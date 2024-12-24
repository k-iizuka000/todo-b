# Terraform state management configuration
terraform {
  backend "s3" {
    # S3 bucket for terraform state
    bucket = "prompthub-terraform-state"
    
    # State file path in the bucket
    key = "terraform/prompthub/terraform.tfstate"
    
    # AWS region for the backend
    region = "ap-northeast-1"
    
    # Enable encryption at rest
    encrypt = true
    
    # DynamoDB table for state locking
    dynamodb_table = "prompthub-terraform-lock"
    
    # Enable versioning
    versioning = true
    
    # Additional security settings
    sse_algorithm = "AES256"
    
    # Tags for cost tracking
    tags = {
      Environment = "production"
      Project     = "prompthub"
      ManagedBy   = "terraform"
    }
  }
}

# Note: The following resources need to be created manually before using this backend:
# 1. S3 bucket with versioning enabled
# 2. DynamoDB table with 'LockID' as primary key
# 3. Appropriate IAM permissions for Terraform to access these resources