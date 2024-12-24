# Provider configuration
provider "aws" {
  region = "ap-northeast-1"
}

# Remote state configuration
terraform {
  backend "s3" {
    bucket         = "prompthub-tfstate-prod"
    key            = "terraform.tfstate"
    region         = "ap-northeast-1"
    encrypt        = true
    dynamodb_table = "prompthub-tfstate-lock-prod"
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

# VPC and Network Configuration
module "vpc" {
  source = "../../modules/vpc"

  environment = "prod"
  vpc_cidr    = "10.0.0.0/16"
  azs         = ["ap-northeast-1a", "ap-northeast-1c"]
}

# ECS Cluster for Application
module "ecs" {
  source = "../../modules/ecs"

  environment     = "prod"
  cluster_name    = "prompthub-prod"
  instance_type   = "t3.medium"
  min_size        = 2
  max_size        = 10
  desired_capacity = 2
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnet_ids
}

# RDS for Database
module "rds" {
  source = "../../modules/rds"

  environment    = "prod"
  instance_class = "db.t3.medium"
  db_name        = "prompthub"
  engine         = "postgres"
  engine_version = "13.7"
  multi_az       = true
  vpc_id         = module.vpc.vpc_id
  subnet_ids     = module.vpc.database_subnet_ids
}

# ElastiCache for Session Management and Caching
module "elasticache" {
  source = "../../modules/elasticache"

  environment     = "prod"
  instance_type   = "cache.t3.medium"
  num_cache_nodes = 2
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnet_ids
}

# S3 for Media Storage
module "s3" {
  source = "../../modules/s3"

  environment = "prod"
  bucket_name = "prompthub-media-prod"
}

# CloudFront for Content Delivery
module "cloudfront" {
  source = "../../modules/cloudfront"

  environment = "prod"
  s3_bucket   = module.s3.bucket_name
  domain_name = "prompthub.com"
}

# Route53 for DNS Management
module "route53" {
  source = "../../modules/route53"

  domain_name     = "prompthub.com"
  environment     = "prod"
  cloudfront_dist = module.cloudfront.distribution_domain_name
}

# SES for Email Notifications
module "ses" {
  source = "../../modules/ses"

  domain_name = "prompthub.com"
  environment = "prod"
}

# CloudWatch for Monitoring
module "monitoring" {
  source = "../../modules/monitoring"

  environment    = "prod"
  cluster_name   = module.ecs.cluster_name
  rds_instance   = module.rds.instance_id
  alert_email    = "admin@prompthub.com"
}

# WAF for Security
module "waf" {
  source = "../../modules/waf"

  environment = "prod"
  cloudfront_distribution_id = module.cloudfront.distribution_id
}

# Outputs
output "vpc_id" {
  value = module.vpc.vpc_id
}

output "rds_endpoint" {
  value = module.rds.endpoint
}

output "cloudfront_domain" {
  value = module.cloudfront.distribution_domain_name
}