resource "aws_cloudwatch_metric_alarm" "high_cpu_front" {
  alarm_name                = "high-cpu-usage-${var.service_frontend_name}"
  comparison_operator       = "GreaterThanThreshold"
  evaluation_periods        = 2
  metric_name               = "CPUUtilization"
  namespace                 = "AWS/ECS"
  period                    = 60
  statistic                 = "Average"
  threshold                 = 85
  dimensions = {
    ClusterName = var.cluster_name
    ServiceName = var.service_frontend_name
  }
  alarm_description         = "This metric monitors high CPU utilization for ${var.service_frontend_name}"
  actions_enabled           = true
}

resource "aws_cloudwatch_metric_alarm" "high_cpu_back" {
  alarm_name                = "high-cpu-usage-${var.service_backend_name}"
  comparison_operator       = "GreaterThanThreshold"
  evaluation_periods        = 2
  metric_name               = "CPUUtilization"
  namespace                 = "AWS/ECS"
  period                    = 60
  statistic                 = "Average"
  threshold                 = 85
  dimensions = {
    ClusterName = var.cluster_name
    ServiceName = var.service_backend_name
  }
  alarm_description         = "This metric monitors high CPU utilization for ${var.service_backend_name}"
  actions_enabled           = true
}

resource "aws_cloudwatch_metric_alarm" "low_cpu_front" {
  alarm_name                = "low-cpu-usage-${var.service_frontend_name}"
  comparison_operator       = "LessThanThreshold"
  evaluation_periods        = 2
  metric_name               = "CPUUtilization"
  namespace                 = "AWS/ECS"
  period                    = 60
  statistic                 = "Average"
  threshold                 = 20
  dimensions = {
    ClusterName = var.cluster_name
    ServiceName = var.service_frontend_name
  }
  alarm_description         = "This metric monitors low CPU utilization for ${var.service_frontend_name}"
  actions_enabled           = true
}

resource "aws_cloudwatch_metric_alarm" "low_cpu_back" {
  alarm_name                = "low-cpu-usage-${var.service_backend_name}"
  comparison_operator       = "LessThanThreshold"
  evaluation_periods        = 2
  metric_name               = "CPUUtilization"
  namespace                 = "AWS/ECS"
  period                    = 60
  statistic                 = "Average"
  threshold                 = 20
  dimensions = {
    ClusterName = var.cluster_name
    ServiceName = var.service_backend_name
  }
  alarm_description         = "This metric monitors low CPU utilization for ${var.service_backend_name}"
  actions_enabled           = true
}

