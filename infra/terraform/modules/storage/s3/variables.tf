# General variables
variable "aws_region" {
  description = "AWS region where the S3 bucket will be created"
  type        = string
  default     = "ap-northeast-1"
}

variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
}

# S3 bucket configuration variables
variable "bucket_name" {
  description = "Name of the S3 bucket"
  type        = string
}

variable "force_destroy" {
  description = "Boolean that indicates if the bucket can be destroyed even if it contains objects"
  type        = bool
  default     = false
}

variable "versioning_enabled" {
  description = "Enable versioning for the S3 bucket"
  type        = bool
  default     = true
}

# Tags
variable "tags" {
  description = "Tags to be applied to the S3 bucket"
  type        = map(string)
  default     = {}
}

# Encryption configuration
variable "encryption_enabled" {
  description = "Enable server-side encryption for the S3 bucket"
  type        = bool
  default     = true
}

variable "kms_master_key_id" {
  description = "The AWS KMS master key ID used for the SSE-KMS encryption (optional)"
  type        = string
  default     = null
}

# Access configuration
variable "public_access_block_enabled" {
  description = "Enable block public access settings for the bucket"
  type        = bool
  default     = true
}

# CORS configuration
variable "cors_enabled" {
  description = "Enable CORS for the S3 bucket"
  type        = bool
  default     = false
}

variable "cors_rules" {
  description = "List of CORS rules"
  type = list(object({
    allowed_headers = list(string)
    allowed_methods = list(string)
    allowed_origins = list(string)
    expose_headers  = list(string)
    max_age_seconds = number
  }))
  default = []
}

# Lifecycle rules
variable "lifecycle_rules" {
  description = "List of lifecycle rules for the bucket"
  type = list(object({
    id                                     = string
    enabled                               = bool
    prefix                                = string
    expiration_days                       = number
    noncurrent_version_expiration_days    = number
  }))
  default = []
}

# Logging configuration
variable "logging_enabled" {
  description = "Enable logging for the S3 bucket"
  type        = bool
  default     = false
}

variable "log_bucket" {
  description = "Name of the bucket for storing access logs"
  type        = string
  default     = ""
}

variable "log_prefix" {
  description = "Prefix for log objects"
  type        = string
  default     = "logs/"
}