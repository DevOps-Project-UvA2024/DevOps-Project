resource "aws_codebuild_project" "backend_build" {
  name          = "eduapp-backend-build"
  description   = "Build project for the backend"
  service_role  = var.codebuild_role_arn

  artifacts {
    type = "CODEPIPELINE"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/standard:4.0"
    type                        = "LINUX_CONTAINER"
    privileged_mode             = true
    environment_variable {
      name  = "AWS_DEFAULT_REGION"
      value = "eu-north-1"
    }
  }

  source {
    type      = "CODEPIPELINE"
    buildspec = "buildspec-backend.yaml"
  }
}

resource "aws_codebuild_project" "frontend_build" {
  name          = "eduapp-frontend-build"
  description   = "Build project for the frontend"
  service_role  = var.codebuild_role_arn // Ensure this role has the necessary permissions

  artifacts {
    type = "CODEPIPELINE"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/standard:4.0"
    type                        = "LINUX_CONTAINER"
    privileged_mode             = true
    environment_variable {
      name  = "AWS_DEFAULT_REGION"
      value = "eu-north-1"
    }
  }

  source {
    type      = "CODEPIPELINE"
    buildspec = "buildspec-frontend.yaml"
  }
}
