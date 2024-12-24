# S3バケット関連の出力値を定義

output "bucket_id" {
  description = "S3バケットのID"
  value       = aws_s3_bucket.this.id
}

output "bucket_arn" {
  description = "S3バケットのARN"
  value       = aws_s3_bucket.this.arn
}

output "bucket_domain_name" {
  description = "S3バケットのドメイン名"
  value       = aws_s3_bucket.this.bucket_domain_name
}

output "bucket_regional_domain_name" {
  description = "S3バケットのリージョナルドメイン名"
  value       = aws_s3_bucket.this.bucket_regional_domain_name
}

output "bucket_website_endpoint" {
  description = "S3バケットのウェブサイトエンドポイント（静的ウェブサイトホスティングが有効な場合）"
  value       = try(aws_s3_bucket.this.website_endpoint, null)
}

output "bucket_website_domain" {
  description = "S3バケットのウェブサイトドメイン（静的ウェブサイトホスティングが有効な場合）"
  value       = try(aws_s3_bucket.this.website_domain, null)
}

output "bucket_versioning_status" {
  description = "S3バケットのバージョニング状態"
  value       = try(aws_s3_bucket_versioning.this[0].versioning_configuration[0].status, "Disabled")
}

output "bucket_encryption_status" {
  description = "S3バケットの暗号化状態"
  value       = try(aws_s3_bucket_server_side_encryption_configuration.this[0].rule[0].apply_server_side_encryption_by_default[0].sse_algorithm, "Disabled")
}