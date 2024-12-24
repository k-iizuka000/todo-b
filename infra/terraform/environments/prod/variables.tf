# Production environment variables for PromptHub AI SaaS Platform

# AWS Region
variable "aws_region" {
  description = "AWS region for deploying resources"
  type        = string
  default     = "us-west-2"
}

# Application Configuration
variable "environment" {
  description = "Environment name"
  type        = string
  default     = "prod"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "prompthub"
}

# VPC Configuration
variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

# Database Configuration
variable "rds_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.large"
}

variable "rds_allocated_storage" {
  description = "Allocated storage for RDS in GB"
  type        = number
  default     = 100
}

# ElasticCache Configuration
variable "elasticache_node_type" {
  description = "ElastiCache node type"
  type        = string
  default     = "cache.t3.medium"
}

# ECS Configuration
variable "ecs_task_cpu" {
  description = "CPU units for ECS tasks"
  type        = number
  default     = 1024
}

variable "ecs_task_memory" {
  description = "Memory for ECS tasks in MiB"
  type        = number
  default     = 2048
}

# Auto Scaling Configuration
variable "min_capacity" {
  description = "Minimum number of tasks"
  type        = number
  default     = 2
}

variable "max_capacity" {
  description = "Maximum number of tasks"
  type        = number
  default     = 10
}

# S3 Configuration
variable "s3_versioning" {
  description = "Enable versioning for S3 buckets"
  type        = bool
  default     = true
}

# CloudFront Configuration
variable "cloudfront_price_class" {
  description = "CloudFront distribution price class"
  type        = string
  default     = "PriceClass_200"
}

# Route53 Configuration
variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = "prompthub.example.com"
}

# Backup Configuration
variable "backup_retention_days" {
  description = "Number of days to retain backups"
  type        = number
  default     = 30
}

# Monitoring Configuration
variable "enable_enhanced_monitoring" {
  description = "Enable enhanced monitoring for RDS"
  type        = bool
  default     = true
}

variable "alarm_email" {
  description = "Email address for CloudWatch alarms"
  type        = string
  default     = "ops@prompthub.example.com"
}

# Security Configuration
variable "ssl_certificate_arn" {
  description = "ARN of SSL certificate"
  type        = string
}

variable "allowed_ip_ranges" {
  description = "List of allowed IP ranges for administrative access"
  type        = list(string)
  default     = []
}

# Tags
variable "common_tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default = {
    Environment = "production"
    Project     = "prompthub"
    ManagedBy   = "terraform"
  }
}