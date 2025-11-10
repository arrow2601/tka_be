pipeline {
    agent any

    environment {
        REGISTRY = "regis.teknolojia.my.id"
        IMAGE_NAME = "hanafsa-be"
        VERSION = "v01"
    }

    stages {

        stage('Checkout') {
            steps {
                echo "📦 Cloning repository..."
                git branch: 'main', url: 'https://github.com/ihsanabuhanifah/tka_be'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "🏗️ Building Docker image..."
                    sh """
                        docker build -t ${REGISTRY}/${IMAGE_NAME}:${VERSION} \
                                     -t ${REGISTRY}/${IMAGE_NAME}:latest .
                    """
                }
            }
        }

        stage('Push to Local Registry') {
            steps {
                script {
                    echo "🚢 Pushing image to local registry..."
                    sh """
                        docker push ${REGISTRY}/${IMAGE_NAME}:${VERSION}
                        docker push ${REGISTRY}/${IMAGE_NAME}:latest
                    """
                }
            }
        }

        stage('Deploy to Web Server') {
    steps {
        echo "🚀 Deploying to 192.168.10.26 (port 26) using username & password..."
        withCredentials([usernamePassword(credentialsId: 'hanafsa', usernameVariable: 'SSH_USER', passwordVariable: 'SSH_PASS')]) {
            sh '''
                sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no  $SSH_USER@hanafsa.web.id "
                    cd ~/hanafsa/ && \
                    docker compose pull && \
                    docker compose up -d
                "
            '''
        }
    }
}
    }

    post {
        success {
            echo "✅ Build, push, and deploy completed successfully!"
        }
        failure {
            echo "❌ Build, push, or deploy failed. Please check logs."
        }
    }
}
