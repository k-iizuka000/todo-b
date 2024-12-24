# General Variables
variable "project" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment (dev/staging/prod)"
  type        = string
}

# Network Variables
variable "vpc_id" {
  description = "VPC ID where the EKS cluster will be created"
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs for the EKS cluster"
  type        = list(string)
}

# EKS Cluster Variables
variable "cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
}

variable "cluster_version" {
  description = "Kubernetes version for the EKS cluster"
  type        = string
  default     = "1.27"
}

variable "cluster_enabled_log_types" {
  description = "List of EKS cluster logging types to enable"
  type        = list(string)
  default     = ["api", "audit", "authenticator", "controllerManager", "scheduler"]
}

# Node Group Variables
variable "node_groups" {
  description = "Map of node group configurations"
  type = map(object({
    instance_types = list(string)
    capacity_type  = string
    disk_size      = number
    min_size      = number
    max_size      = number
    desired_size  = number
    labels        = map(string)
    taints        = list(map(string))
  }))
  default = {}
}

# IAM Variables
variable "cluster_role_name" {
  description = "Name of the IAM role for the EKS cluster"
  type        = string
  default     = null
}

variable "node_role_name" {
  description = "Name of the IAM role for the EKS nodes"
  type        = string
  default     = null
}

# Security Variables
variable "endpoint_private_access" {
  description = "Enable private API server endpoint"
  type        = bool
  default     = true
}

variable "endpoint_public_access" {
  description = "Enable public API server endpoint"
  type        = bool
  default     = false
}

variable "public_access_cidrs" {
  description = "List of CIDR blocks that can access the public API server endpoint"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

# Tags
variable "tags" {
  description = "Additional tags for all resources"
  type        = map(string)
  default     = {}
}

# Add-ons Variables
variable "enable_aws_load_balancer_controller" {
  description = "Enable AWS Load Balancer Controller add-on"
  type        = bool
  default     = true
}

variable "enable_cluster_autoscaler" {
  description = "Enable Cluster Autoscaler add-on"
  type        = bool
  default     = true
}

variable "enable_metrics_server" {
  description = "Enable Metrics Server add-on"
  type        = bool
  default     = true
}

# KMS Variables
variable "enable_kms_encryption" {
  description = "Enable KMS encryption for the EKS cluster"
  type        = bool
  default     = true
}

variable "kms_key_arn" {
  description = "ARN of the KMS key for encryption"
  type        = string
  default     = null
}

# Monitoring and Logging
variable "enable_cloudwatch_metrics" {
  description = "Enable CloudWatch metrics collection"
  type        = bool
  default     = true
}

variable "retention_days" {
  description = "Number of days to retain CloudWatch logs"
  type        = number
  default     = 30
}