# S3 Bucket
resource "aws_s3_bucket" "eduapp_bucket" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_policy" "eduapp_bucket_policy" {
  bucket = aws_s3_bucket.eduapp_bucket.id
  policy = var.policy
}