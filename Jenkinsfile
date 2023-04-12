pipeline {
    agent any
    stages {
        stage('build') {
            agent { dockerfile { filename 'Dockerfile.ci' } }
            steps {
                sh 'pnpm install'
                sh 'pnpm run build'

                stash includes: "dist/", name: "dist"
            }
        }

        stage('deploy') {

            steps {
                unstash "dist"
                sh 'docker compose build'
                sh 'docker compose up -d'
            }
        }

        stage('clean') {

            steps {
                sh '''
                   set +e
                   docker rmi $(docker images -f 'dangling=true' -q)
                   set -e
                   '''
            }
        }
    }
}