# ステージング環境の基本設定
variable "environment" {
  description = "環境名"
  type        = string
  default     = "staging"
}

# プロジェクト設定
variable "project_name" {
  description = "プロジェクト名"
  type        = string
  default     = "prompthub"
}

# リージョン設定
variable "aws_region" {
  description = "AWSリージョン"
  type        = string
  default     = "ap-northeast-1"
}

# インフラストラクチャ設定
variable "vpc_cidr" {
  description = "VPCのCIDRブロック"
  type        = string
  default     = "10.1.0.0/16"  # ステージング環境用
}

# アプリケーション設定
variable "app_port" {
  description = "アプリケーションポート"
  type        = number
  default     = 3000
}

variable "app_instance_type" {
  description = "アプリケーションサーバーのインスタンスタイプ"
  type        = string
  default     = "t3.medium"  # ステージング環境用
}

# データベース設定
variable "db_instance_type" {
  description = "RDSインスタンスタイプ"
  type        = string
  default     = "db.t3.medium"  # ステージング環境用
}

variable "db_storage" {
  description = "RDSストレージサイズ(GB)"
  type        = number
  default     = 50
}

# キャッシュ設定
variable "cache_node_type" {
  description = "Elasticacheノードタイプ"
  type        = string
  default     = "cache.t3.micro"  # ステージング環境用
}

# バックアップ設定
variable "backup_retention_period" {
  description = "バックアップ保持期間（日）"
  type        = number
  default     = 7
}

# オートスケーリング設定
variable "min_capacity" {
  description = "最小インスタンス数"
  type        = number
  default     = 1
}

variable "max_capacity" {
  description = "最大インスタンス数"
  type        = number
  default     = 3
}

# 監視設定
variable "alarm_email" {
  description = "アラート通知用メールアドレス"
  type        = string
  default     = "staging-alert@prompthub.example.com"
}

# CDN設定
variable "cdn_enabled" {
  description = "CloudFront CDNの有効化"
  type        = bool
  default     = true
}

# セキュリティ設定
variable "ssl_certificate_arn" {
  description = "SSL証明書のARN"
  type        = string
  default     = ""  # 実際の証明書ARNを設定
}

# タグ設定
variable "common_tags" {
  description = "共通タグ"
  type        = map(string)
  default = {
    Environment = "staging"
    Project     = "prompthub"
    Terraform   = "true"
  }
}

# 機能フラグ
variable "feature_flags" {
  description = "機能フラグの設定"
  type        = map(bool)
  default = {
    enable_multi_language = true
    enable_export_import = true
    enable_notifications = true
  }
}