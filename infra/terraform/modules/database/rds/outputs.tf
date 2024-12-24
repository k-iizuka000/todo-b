# RDS instance outputs
output "db_instance_id" {
  description = "The RDS instance ID"
  value       = aws_db_instance.main.id
}

output "db_instance_address" {
  description = "The address of the RDS instance"
  value       = aws_db_instance.main.address
}

output "db_instance_endpoint" {
  description = "The connection endpoint for the RDS instance"
  value       = aws_db_instance.main.endpoint
}

output "db_instance_port" {
  description = "The database port"
  value       = aws_db_instance.main.port
}

output "db_instance_name" {
  description = "The database name"
  value       = aws_db_instance.main.db_name
}

output "db_instance_username" {
  description = "The master username for the database"
  value       = aws_db_instance.main.username
  sensitive   = true
}

output "db_instance_arn" {
  description = "The ARN of the RDS instance"
  value       = aws_db_instance.main.arn
}

# Security Group outputs
output "db_security_group_id" {
  description = "The ID of the security group used by the RDS instance"
  value       = aws_security_group.rds.id
}

# Subnet Group outputs
output "db_subnet_group_id" {
  description = "The ID of the DB subnet group"
  value       = aws_db_subnet_group.main.id
}

output "db_subnet_group_arn" {
  description = "The ARN of the DB subnet group"
  value       = aws_db_subnet_group.main.arn
}

# Parameter Group outputs
output "db_parameter_group_id" {
  description = "The ID of the DB parameter group"
  value       = aws_db_parameter_group.main.id
}

# Monitoring related outputs
output "enhanced_monitoring_arn" {
  description = "The ARN of the enhanced monitoring role"
  value       = aws_db_instance.main.monitoring_role_arn
}

# Backup related outputs
output "backup_retention_period" {
  description = "The backup retention period"
  value       = aws_db_instance.main.backup_retention_period
}

output "latest_restorable_time" {
  description = "The latest time to which the database can be restored"
  value       = aws_db_instance.main.latest_restorable_time
}