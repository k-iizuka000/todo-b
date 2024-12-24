# General RDS configuration variables
variable "identifier" {
  description = "The name of the RDS instance"
  type        = string
}

variable "engine" {
  description = "The database engine to use"
  type        = string
  default     = "postgres"
}

variable "engine_version" {
  description = "The engine version to use"
  type        = string
  default     = "13.7"
}

variable "instance_class" {
  description = "The instance type of the RDS instance"
  type        = string
  default     = "db.t3.micro"
}

# Storage configuration
variable "allocated_storage" {
  description = "The allocated storage in gigabytes"
  type        = number
  default     = 20
}

variable "max_allocated_storage" {
  description = "The upper limit of scalable storage in gigabytes"
  type        = number
  default     = 100
}

# Network configuration
variable "subnet_ids" {
  description = "A list of VPC subnet IDs"
  type        = list(string)
}

variable "vpc_security_group_ids" {
  description = "List of VPC security groups to associate"
  type        = list(string)
}

# Database configuration
variable "database_name" {
  description = "The name of the database to create"
  type        = string
}

variable "username" {
  description = "Username for the master DB user"
  type        = string
}

variable "password" {
  description = "Password for the master DB user"
  type        = string
  sensitive   = true
}

# Backup and maintenance configuration
variable "backup_retention_period" {
  description = "The days to retain backups for"
  type        = number
  default     = 7
}

variable "backup_window" {
  description = "The daily time range during which automated backups are created"
  type        = string
  default     = "03:00-04:00"
}

variable "maintenance_window" {
  description = "The window to perform maintenance in"
  type        = string
  default     = "Mon:04:00-Mon:05:00"
}

# Performance and monitoring
variable "monitoring_interval" {
  description = "The interval, in seconds, between points when Enhanced Monitoring metrics are collected"
  type        = number
  default     = 60
}

variable "performance_insights_enabled" {
  description = "Specifies whether Performance Insights are enabled"
  type        = bool
  default     = true
}

# Tags
variable "tags" {
  description = "A mapping of tags to assign to the resource"
  type        = map(string)
  default     = {}
}

# High availability configuration
variable "multi_az" {
  description = "Specifies if the RDS instance is multi-AZ"
  type        = bool
  default     = false
}

# Encryption configuration
variable "storage_encrypted" {
  description = "Specifies whether the DB instance is encrypted"
  type        = bool
  default     = true
}

variable "kms_key_id" {
  description = "The ARN for the KMS encryption key"
  type        = string
  default     = null
}

# Parameter group configuration
variable "parameter_group_family" {
  description = "The family of the DB parameter group"
  type        = string
  default     = "postgres13"
}

variable "parameters" {
  description = "A list of DB parameters to apply"
  type = list(object({
    name  = string
    value = string
  }))
  default = []
}