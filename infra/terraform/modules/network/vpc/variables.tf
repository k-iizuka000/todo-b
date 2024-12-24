# VPC基本設定
variable "project" {
  description = "プロジェクト名"
  type        = string
}

variable "environment" {
  description = "環境名 (dev/stg/prod)"
  type        = string
  validation {
    condition     = contains(["dev", "stg", "prod"], var.environment)
    error_message = "環境名は 'dev', 'stg', 'prod' のいずれかである必要があります。"
  }
}

# VPCネットワーク設定
variable "vpc_cidr" {
  description = "VPCのCIDRブロック"
  type        = string
  default     = "10.0.0.0/16"
  validation {
    condition     = can(cidrhost(var.vpc_cidr, 0))
    error_message = "有効なCIDRブロックを指定してください。"
  }
}

variable "enable_dns_hostnames" {
  description = "VPC内のDNSホスト名を有効にするかどうか"
  type        = bool
  default     = true
}

variable "enable_dns_support" {
  description = "VPC内のDNSサポートを有効にするかどうか"
  type        = bool
  default     = true
}

# サブネット設定
variable "public_subnet_cidrs" {
  description = "パブリックサブネットのCIDRブロックのリスト"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "プライベートサブネットのCIDRブロックのリスト"
  type        = list(string)
  default     = ["10.0.11.0/24", "10.0.12.0/24"]
}

variable "availability_zones" {
  description = "使用するアベイラビリティゾーンのリスト"
  type        = list(string)
}

# タグ設定
variable "tags" {
  description = "リソースに付与する追加のタグ"
  type        = map(string)
  default     = {}
}

# NATゲートウェイ設定
variable "enable_nat_gateway" {
  description = "NATゲートウェイを作成するかどうか"
  type        = bool
  default     = true
}

variable "single_nat_gateway" {
  description = "単一のNATゲートウェイを使用するかどうか（コスト最適化用）"
  type        = bool
  default     = false
}

# VPCフロー設定
variable "enable_flow_log" {
  description = "VPCフローログを有効にするかどうか"
  type        = bool
  default     = false
}

variable "flow_log_retention_in_days" {
  description = "VPCフローログの保持期間（日数）"
  type        = number
  default     = 7
  validation {
    condition     = var.flow_log_retention_in_days >= 1
    error_message = "保持期間は1日以上である必要があります。"
  }
}

# エンドポイント設定
variable "enable_vpc_endpoints" {
  description = "VPCエンドポイントを作成するかどうか"
  type        = bool
  default     = false
}

variable "vpc_endpoint_services" {
  description = "作成するVPCエンドポイントのサービス名リスト"
  type        = list(string)
  default     = ["s3", "dynamodb"]
}