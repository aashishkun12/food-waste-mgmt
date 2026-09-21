provider "aws" {
  region = "ap-south-1"
}

resource "aws_s3_bucket" "foodwaste_dev_tfstate" {
  bucket = var.bucket-name
  tags = {
    Name = "foodwaste-dev-tfstate-12"
  }
}

resource "aws_s3_bucket_versioning" "bucket-version" {
  bucket = var.bucket-name
  versioning_configuration {
    status = "Enabled"
  }
}