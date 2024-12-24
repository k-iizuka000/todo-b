# Staging Environment Terraform Configuration

terraform {
  required_version = ">= 1.0.0"
  
  backend "s3" {
    bucket         = "prompthub-terraform-state-staging"
    key            = "terraform.tfstate"
    region         = "ap-northeast-1"
    encrypt        = true
    dynamodb_table = "prompthub-terraform-locks-staging"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = local.region
}

locals {
  region      = "ap-northeast-1"
  environment = "staging"
  service     = "prompthub"

  tags = {
    Environment = local.environment
    Service     = local.service
    ManagedBy   = "terraform"
  }
}

# VPC Configuration
module "vpc" {
  source = "../../modules/vpc"

  environment = local.environment
  service     = local.service
  cidr_block  = "10.1.0.0/16"  # Staging VPC CIDR
  tags        = local.tags
}

# ECS Configuration
module "ecs" {
  source = "../../modules/ecs"

  environment        = local.environment
  service           = local.service
  vpc_id            = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  tags              = local.tags
}

# RDS Configuration
module "rds" {
  source = "../../modules/rds"

  environment        = local.environment
  service           = local.service
  vpc_id            = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  instance_class    = "db.t3.small"  # Staging instance size
  tags              = local.tags
}

# ElastiCache Configuration
module "elasticache" {
  source = "../../modules/elasticache"

  environment        = local.environment
  service           = local.service
  vpc_id            = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  instance_type     = "cache.t3.micro"  # Staging instance size
  tags              = local.tags
}

# S3 Configuration for User Uploads
module "s3" {
  source = "../../modules/s3"

  environment = local.environment
  service     = local.service
  tags        = local.tags
}

# CloudFront Configuration
module "cloudfront" {
  source = "../../modules/cloudfront"

  environment     = local.environment
  service        = local.service
  s3_bucket_id   = module.s3.bucket_id
  s3_domain_name = module.s3.domain_name
  tags           = local.tags
}

# Route53 Configuration
module "route53" {
  source = "../../modules/route53"

  environment         = local.environment
  service            = local.service
  cloudfront_domain  = module.cloudfront.domain_name
  cloudfront_zone_id = module.cloudfront.hosted_zone_id
  tags               = local.tags
}

# SES Configuration for Email Notifications
module "ses" {
  source = "../../modules/ses"

  environment = local.environment
  service     = local.service
  domain      = "staging.prompthub.example.com"
  tags        = local.tags
}

# CloudWatch Configuration
module "cloudwatch" {
  source = "../../modules/cloudwatch"

  environment = local.environment
  service     = local.service
  tags        = local.tags
}

# Outputs
output "vpc_id" {
  value = module.vpc.vpc_id
}

output "rds_endpoint" {
  value     = module.rds.endpoint
  sensitive = true
}

output "elasticache_endpoint" {
  value     = module.elasticache.endpoint
  sensitive = true
}

output "cloudfront_domain" {
  value = module.cloudfront.domain_name
}