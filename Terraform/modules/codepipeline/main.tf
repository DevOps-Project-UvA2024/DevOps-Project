resource "aws_codepipeline" "eduapp_pipeline" {
  name     = "eduapp-pipeline"
  role_arn = var.role_arn

  artifact_store {
    location = var.s3_bucket_for_artifacts
    type     = "S3"
  }

  stage {
    name = "Source"
    action {
      name             = "SourceAction"
      category         = "Source"
      owner            = "AWS"
      provider         = "CodeStarSourceConnection"
      version          = "1"
      output_artifacts = ["SourceArtifact"]

      configuration = {
        ConnectionArn    = "arn:aws:codestar-connections:eu-north-1:143898400191:connection/f95de504-3ce4-4b9c-bfad-15e84b76ea71"
        FullRepositoryId = "DevOps-Project-UvA2024/DevOps-Project"
        BranchName       = "dev"
        DetectChanges    = "true"
      }
    }
  }

  stage {
    name = "Build"
    action {
      name             = "Build_Backend"
      category         = "Build"
      owner            = "AWS"
      provider         = "CodeBuild"
      input_artifacts  = ["SourceArtifact"]
      output_artifacts = ["BuildBackArtifact"]
      version          = "1"

      configuration = {
        ProjectName = var.backend_build_project_name
      }
    }
    action {
      name             = "Build_Frontend"
      category         = "Build"
      owner            = "AWS"
      provider         = "CodeBuild"
      input_artifacts  = ["SourceArtifact"]
      output_artifacts = ["BuildFrontArtifact"]
      version          = "1"

      configuration = {
        ProjectName = var.frontend_build_project_name
      }
    }
  }

  stage {
    name = "Deploy"
    action {
      name            = "Deploy_Backend"
      category        = "Deploy"
      owner           = "AWS"
      provider        = "ECS"
      input_artifacts = ["BuildBackArtifact"]
      version         = "1"

      configuration = {
        ClusterName = var.ecs_cluster_name
        ServiceName = var.backend_service_name
        FileName    = "imagedefinitions-backend.json"
      }
    }
    action {
      name            = "Deploy_Frontend"
      category        = "Deploy"
      owner           = "AWS"
      provider        = "ECS"
      input_artifacts = ["BuildFrontArtifact"]
      version         = "1"

      configuration = {
        ClusterName = var.ecs_cluster_name
        ServiceName = var.frontend_service_name
        FileName    = "imagedefinitions-frontend.json"
      }
    }
  }
}