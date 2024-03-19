# ECR for Backend
resource "aws_ecr_repository" "backend_repo" {
  name                 = "devops-project-backend"
  image_tag_mutability = "MUTABLE"

  tags = {
    Name = "devops-project-backend"
  }
}

# ECR for Frontend
resource "aws_ecr_repository" "frontend_repo" {
  name                 = "devops-project-frontend"
  image_tag_mutability = "MUTABLE"

  tags = {
    Name = "devops-project-frontend"
  }
}
