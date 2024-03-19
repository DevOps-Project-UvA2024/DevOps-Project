module "vpc" {
  source   = "./modules/vpc"
  vpc_cidr = var.vpc_cidr
}

module "security_groups" {
  source    = "./modules/security_groups"
  vpc_id = module.vpc.vpc_id
  eduapp_nat_gateway_id = module.vpc.nat_gateway_id
  eduapp_private_subnet_1_id = module.vpc.private_subnet_ids[0]
  eduapp_private_subnet_2_id = module.vpc.private_subnet_ids[1]
}

module "iam" {
  source       = "./modules/iam"
}

module "eduapp_cred_bucket" {
  source            = "./modules/s3"
  bucket_name       = "eduappcredbucket"
  versioning_enabled = false
  policy            = file("${path.module}/modules/s3/policies/eduappcred_policy.json")
  tags              = {
    "Project"     = "EduApp"
  }
  
}

module "eduapp_bucket" {
  source            = "./modules/s3"
  bucket_name       = "eduappbucket"
  versioning_enabled = false
  policy            = file("${path.module}/modules/s3/policies/eduappfiles_policy.json")
  tags              = {
    "Project"     = "EduApp"
  }
}

module "eduapp_codepipeline_bucket" {
  source = "./modules/s3"
  bucket_name       = "eduapp-pipeline-bucket"
  versioning_enabled = false
  policy            = file("${path.module}/modules/s3/policies/eduapp_pipeline_policy.json")
  tags              = {
    "Project"     = "EduApp"
  }
}

module "rds" {
  source = "./modules/rds"
  db_password = var.db_password
  private_subnet_ids = module.vpc.private_subnet_ids
  rds_security_group_id = module.security_groups.rds_sg_id
}

module "lambda" {
  source = "./modules/lambda"
  lambda_role_arn = module.iam.lambda_role_arn
  private_subnet_ids = module.vpc.private_subnet_ids
  db_username = var.db_username
  db_endpoint = module.rds.eduapp_db_endpoint
  security_group_id = module.security_groups.ecr_sg_id
  db_password = var.db_password
  eduapp_ecr_sg_id = module.security_groups.ecr_sg_id
}

module "ecr" {
  source = "./modules/ecr"
}

module "alb" {
  source = "./modules/alb"
  public_subnet_ids = module.vpc.public_subnet_ids
  eduapp_lb_sg = module.security_groups.lb_sg_id
  vpc_id = module.vpc.vpc_id
}

module "cognito" {
  source = "./modules/cognito"
}

locals {
  env_content = templatefile("${path.module}/cred.tpl", {
    cognito_user_pool_id = "${module.cognito.cognito_user_pool_id}"
    cognito_client_id    = "${module.cognito.cognito_client_id}"
    region               = "eu-north-1"
    db_host              = "${module.rds.eduapp_db_endpoint}"
    db_user              = "root"
    db_pass              = "rootroot"
    db_name              = "eduapp"
    bucket_name          = "eduappbucket"
  })
}

resource "aws_s3_object" "env_file" {
  bucket  = module.eduapp_cred_bucket.bucket_name
  key     = "cred.env"
  content = local.env_content
}

module "codebuild" {
  source = "./modules/codebuild"
  codebuild_role_arn = module.iam.codebuild_role_arn
  buildspec_backend = var.buildspec_backend
  buildspec_frontend = var.buildspec_frontend
}

module "ecs" {
  source = "./modules/ecs"
  backend_image = module.ecr.backend_repository_url
  frontend_image = module.ecr.frontend_repository_url
  public_subnet_ids = module.vpc.public_subnet_ids
  private_subnet_ids = module.vpc.private_subnet_ids
  cred_env_s3_arn = aws_s3_object.env_file.arn
  backend_target_group_arn = module.alb.back_target_group_arn
  frontend_target_group_arn = module.alb.front_target_group_arn
  frontend_sg_id = module.security_groups.lb_sg_id
  backend_sg_id = module.security_groups.backend_sg_id
  frontend_listener_arn = module.alb.alb_listener
  task_execution_role = module.iam.ecs_s3_access_role_arn
}

module "codepipeline" {
  source = "./modules/codepipeline"
  frontend_build_project_name = module.codebuild.frontend_build_project_name
  backend_build_project_name = module.codebuild.backend_build_project_name
  frontend_service_name = module.ecs.frontend_service_name
  backend_service_name = module.ecs.backend_service_name
  ecs_cluster_name = module.ecs.ecs_cluster_id
  s3_bucket_for_artifacts = module.eduapp_codepipeline_bucket.bucket_name
  role_arn = module.iam.codepipeline_role_arn
}