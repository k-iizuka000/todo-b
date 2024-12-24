# VPC関連の出力定義

output "vpc_id" {
  description = "作成されたVPCのID"
  value       = aws_vpc.main.id
}

output "vpc_arn" {
  description = "作成されたVPCのARN"
  value       = aws_vpc.main.arn
}

output "vpc_cidr_block" {
  description = "VPCのCIDRブロック"
  value       = aws_vpc.main.cidr_block
}

output "public_subnet_ids" {
  description = "パブリックサブネットのID一覧"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "プライベートサブネットのID一覧"
  value       = aws_subnet.private[*].id
}

output "database_subnet_ids" {
  description = "データベースサブネットのID一覧"
  value       = aws_subnet.database[*].id
}

output "public_route_table_id" {
  description = "パブリックルートテーブルのID"
  value       = aws_route_table.public.id
}

output "private_route_table_ids" {
  description = "プライベートルートテーブルのID一覧"
  value       = aws_route_table.private[*].id
}

output "nat_gateway_ids" {
  description = "NATゲートウェイのID一覧"
  value       = aws_nat_gateway.main[*].id
}

output "internet_gateway_id" {
  description = "インターネットゲートウェイのID"
  value       = aws_internet_gateway.main.id
}

output "vpc_endpoint_s3_id" {
  description = "S3 VPCエンドポイントのID"
  value       = aws_vpc_endpoint.s3.id
}

output "vpc_endpoint_dynamodb_id" {
  description = "DynamoDB VPCエンドポイントのID"
  value       = aws_vpc_endpoint.dynamodb.id
}

output "vpc_flow_log_id" {
  description = "VPCフローログのID"
  value       = aws_flow_log.main.id
}

output "availability_zones" {
  description = "使用されているアベイラビリティゾーンの一覧"
  value       = var.availability_zones
}

output "environment" {
  description = "環境名（production、staging等）"
  value       = var.environment
}