# EKS Cluster outputs
output "cluster_id" {
  description = "The name/id of the EKS cluster"
  value       = aws_eks_cluster.main.id
}

output "cluster_arn" {
  description = "The Amazon Resource Name (ARN) of the cluster"
  value       = aws_eks_cluster.main.arn
}

output "cluster_endpoint" {
  description = "The endpoint for the EKS cluster API server"
  value       = aws_eks_cluster.main.endpoint
}

output "cluster_version" {
  description = "The Kubernetes server version for the EKS cluster"
  value       = aws_eks_cluster.main.version
}

output "cluster_security_group_id" {
  description = "Security group ID attached to the EKS cluster"
  value       = aws_eks_cluster.main.vpc_config[0].cluster_security_group_id
}

# EKS Node Group outputs
output "node_group_id" {
  description = "EKS Node Group ID"
  value       = aws_eks_node_group.main.id
}

output "node_group_arn" {
  description = "Amazon Resource Name (ARN) of the EKS Node Group"
  value       = aws_eks_node_group.main.arn
}

output "node_group_status" {
  description = "Status of the EKS Node Group"
  value       = aws_eks_node_group.main.status
}

# OIDC Provider outputs
output "cluster_oidc_issuer_url" {
  description = "The URL on the EKS cluster for the OpenID Connect identity provider"
  value       = aws_eks_cluster.main.identity[0].oidc[0].issuer
}

# Kubernetes configuration
output "kubeconfig_certificate_authority_data" {
  description = "Base64 encoded certificate data required to communicate with the cluster"
  value       = aws_eks_cluster.main.certificate_authority[0].data
  sensitive   = true
}

# IAM Role outputs
output "cluster_role_arn" {
  description = "ARN of the EKS cluster IAM role"
  value       = aws_eks_cluster.main.role_arn
}

output "node_group_role_arn" {
  description = "ARN of the EKS node group IAM role"
  value       = aws_eks_node_group.main.node_role_arn
}

# VPC Configuration
output "cluster_vpc_config" {
  description = "VPC configuration for the EKS cluster"
  value = {
    vpc_id             = aws_eks_cluster.main.vpc_config[0].vpc_id
    subnet_ids         = aws_eks_cluster.main.vpc_config[0].subnet_ids
    security_group_ids = aws_eks_cluster.main.vpc_config[0].security_group_ids
  }
}

# Tags
output "cluster_tags" {
  description = "Tags applied to the EKS cluster"
  value       = aws_eks_cluster.main.tags
}