# General Settings
environment = "production"
project_name = "prompthub"
region = "us-west-2"

# Network Settings
vpc_cidr = "10.0.0.0/16"
public_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
private_subnets = ["10.0.3.0/24", "10.0.4.0/24"]
availability_zones = ["us-west-2a", "us-west-2b"]

# Database Settings
rds_instance_class = "db.t3.medium"
rds_allocated_storage = 50
rds_max_allocated_storage = 100
rds_backup_retention_period = 7
rds_multi_az = true

# ElasticCache Settings
elasticache_node_type = "cache.t3.medium"
elasticache_num_cache_nodes = 2

# ECS Settings
ecs_task_cpu = "1024"
ecs_task_memory = "2048"
app_min_capacity = 2
app_max_capacity = 10
app_target_cpu_utilization = 70

# ALB Settings
alb_idle_timeout = 60
enable_deletion_protection = true

# Cloudfront Settings
cloudfront_price_class = "PriceClass_All"
cloudfront_minimum_protocol_version = "TLSv1.2_2021"

# S3 Settings
s3_versioning = true
s3_lifecycle_rule_days = 90

# Monitoring and Logging
enable_enhanced_monitoring = true
monitoring_interval = 60
log_retention_days = 30

# Security Settings
allowed_ips = [
  "0.0.0.0/0"  # 本番環境では実際のIPアドレス範囲に制限することを推奨
]

# Backup Settings
enable_automated_backups = true
backup_window = "03:00-04:00"
maintenance_window = "Mon:04:00-Mon:05:00"

# Route53 Settings
domain_name = "prompthub.example.com"
create_dns_record = true

# Tags
common_tags = {
  Environment = "Production"
  Project     = "PromptHub"
  ManagedBy   = "Terraform"
  Owner       = "DevOps"
}

# Application Specific Settings
app_environment_variables = {
  NODE_ENV = "production"
  LOG_LEVEL = "info"
  ENABLE_CACHE = "true"
  SESSION_TIMEOUT = "3600"
}

# WAF Settings
enable_waf = true
waf_block_rules = {
  max_request_rate = 2000
  ip_rate_limit    = 2000
}

# Performance Settings
enable_performance_insights = true
performance_insights_retention_period = 7

# Disaster Recovery
enable_cross_region_backup = true
backup_region = "us-east-1"