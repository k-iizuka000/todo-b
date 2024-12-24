# General
environment = "staging"
project_name = "prompthub"
region       = "ap-northeast-1"

# Network
vpc_cidr             = "10.1.0.0/16"
public_subnet_cidrs  = ["10.1.1.0/24", "10.1.2.0/24"]
private_subnet_cidrs = ["10.1.10.0/24", "10.1.11.0/24"]

# ECS
ecs_cluster_name = "prompthub-staging"
container_insights_enabled = true

# Application
app_instance_count = 2
app_instance_type = "t3.small"
min_capacity      = 1
max_capacity      = 4
desired_capacity  = 2

# Database
db_instance_class    = "db.t3.small"
db_allocated_storage = 20
db_engine_version    = "13.7"
db_multi_az         = false

# Redis (for session and caching)
redis_node_type = "cache.t3.micro"
redis_num_cache_nodes = 1

# S3 (for user uploads and static assets)
bucket_versioning = true
lifecycle_rule_enabled = true

# CloudFront
cloudfront_price_class = "PriceClass_200"
cloudfront_enabled = true

# Route53
domain_name = "staging.prompthub.example.com"

# Monitoring and Logging
retention_in_days = 30
alarm_evaluation_periods = 2
alarm_period = 300

# Security
ssl_certificate_arn = "arn:aws:acm:us-east-1:123456789012:certificate/abcd1234-efgh-5678-ijkl-90mnopqrstuv"

# Backup
backup_retention_period = 7
backup_window = "03:00-04:00"
maintenance_window = "Mon:04:00-Mon:05:00"

# Tags
default_tags = {
  Environment = "staging"
  Project     = "prompthub"
  ManagedBy   = "terraform"
  Team        = "devops"
}

# Application specific
app_environment_variables = {
  NODE_ENV = "staging"
  LOG_LEVEL = "debug"
  ENABLE_SWAGGER = "true"
  API_RATE_LIMIT = "100"
  SESSION_DURATION = "86400"
}

# Feature flags
enable_monitoring = true
enable_alerting = true
enable_cdn = true
enable_waf = true