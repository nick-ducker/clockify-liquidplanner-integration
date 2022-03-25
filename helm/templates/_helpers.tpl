{{/*
Expand the name of the chart.
*/}}
{{- define "clockify-lp-int.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "clockify-lp-int.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "clockify-lp-int.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "clockify-lp-int.labels" -}}
client: atomix
app: {{ .Chart.Name }}
helm.sh/chart: {{ include "clockify-lp-int.chart" . }}
{{ include "clockify-lp-int.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Gitlab annotations
*/}}
{{- define "clockify-lp-int.gitlab-annotations" -}}
app.gitlab.com/app: {{ .Values.gitlab.app }}
app.gitlab.com/env: {{ .Values.gitlab.env }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "clockify-lp-int.selectorLabels" -}}
app.kubernetes.io/name: {{ include "clockify-lp-int.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
