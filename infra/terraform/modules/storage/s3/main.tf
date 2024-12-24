# S3バケットのメインリソース定義
resource "aws_s3_bucket" "main" {
  bucket = "${var.project_name}-${var.environment}-${var.bucket_name}"

  tags = merge(var.tags, {
    Name        = "${var.project_name}-${var.environment}-${var.bucket_name}"
    Environment = var.environment
  })
}

# バケットのバージョニング設定
resource "aws_s3_bucket_versioning" "main" {
  bucket = aws_s3_bucket.main.id
  versioning_configuration {
    status = var.enable_versioning ? "Enabled" : "Disabled"
  }
}

# バケットの暗号化設定
resource "aws_s3_bucket_server_side_encryption_configuration" "main" {
  bucket = aws_s3_bucket.main.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# パブリックアクセスブロック設定
resource "aws_s3_bucket_public_access_block" "main" {
  bucket = aws_s3_bucket.main.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# バケットライフサイクルルール
resource "aws_s3_bucket_lifecycle_configuration" "main" {
  bucket = aws_s3_bucket.main.id

  rule {
    id     = "cleanup_old_files"
    status = "Enabled"

    transition {
      days          = 90
      storage_class = "STANDARD_IA"
    }

    expiration {
      days = 365
    }
  }
}

# CORSルール設定
resource "aws_s3_bucket_cors_configuration" "main" {
  bucket = aws_s3_bucket.main.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "POST", "PUT", "DELETE"]
    allowed_origins = var.allowed_origins
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# バケットポリシー
resource "aws_s3_bucket_policy" "main" {
  bucket = aws_s3_bucket.main.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "DenyUnencryptedObjectUploads"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:PutObject"
        Resource  = "${aws_s3_bucket.main.arn}/*"
        Condition = {
          StringNotEquals = {
            "s3:x-amz-server-side-encryption" = "AES256"
          }
        }
      }
    ]
  })
}

# バックアップ設定
resource "aws_s3_bucket_replication_configuration" "main" {
  count = var.enable_replication ? 1 : 0

  role   = var.replication_role_arn
  bucket = aws_s3_bucket.main.id

  rule {
    id     = "backup"
    status = "Enabled"

    destination {
      bucket        = var.destination_bucket_arn
      storage_class = "STANDARD_IA"
    }
  }

  depends_on = [aws_s3_bucket_versioning.main]
}
variable "project_name" {
  description = "プロジェクト名"
  type        = string
}

variable "environment" {
  description = "環境名（dev/staging/prod等）"
  type        = string
}

variable "bucket_name" {
  description = "バケット名"
  type        = string
}

variable "tags" {
  description = "リソースに付与するタグ"
  type        = map(string)
  default     = {}
}

variable "enable_versioning" {
  description = "バージョニングを有効にするかどうか"
  type        = bool
  default     = true
}

variable "allowed_origins" {
  description = "CORSで許可するオリジン"
  type        = list(string)
}

variable "enable_replication" {
  description = "レプリケーションを有効にするかどうか"
  type        = bool
  default     = false
}

variable "replication_role_arn" {
  description = "レプリケーション用のIAMロールのARN"
  type        = string
  default     = ""
}

variable "destination_bucket_arn" {
  description = "レプリケーション先バケットのARN"
  type        = string
  default     = ""
}