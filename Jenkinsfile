pipeline {
    agent any
    stages {
        stage('build') {
            agent { docker { image 'node:latest' } }
            steps {
                sh 'curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm'
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