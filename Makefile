GITHUB_REF ?= refs/heads/github-actions-1
BRANCH_NAME = $(subst refs/heads/,,$(GITHUB_REF))
DOCKER_BRANCH = $(subst /,-,$(BRANCH_NAME))
APP_REPO=js-payments
APP_BRANCH=$(DOCKER_BRANCH)

ifeq ($(BRANCH_NAME),master)
TEST_BRANCH = master
else ifeq ($(findstring release/,$(BRANCH_NAME)),release/)
TEST_BRANCH = master
else ifeq ($(findstring hotfix/,$(BRANCH_NAME)),hotfix/)
TEST_BRANCH = master
else
TEST_BRANCH = develop
endif

build-app-docker:
	docker build . --tag "securetrading1/js-payments:$(DOCKER_BRANCH)"
	echo "$(DOCKER_PASSWORD)" | docker login --username "$(DOCKER_USERNAME)" --password-stdin
	docker push "securetrading1/js-payments:$(DOCKER_BRANCH)"

DOCKER_COMPOSE_ENV=APP_REPO=$(APP_REPO) APP_BRANCH=$(APP_BRANCH)
docker-compose-up:
	rm -Rf py-payments-testing
	git clone --branch=$(TEST_BRANCH) --single-branch --depth=1 https://github.com/SecureTrading/py-payments-testing.git
	$(DOCKER_COMPOSE_ENV) docker-compose -f py-payments-testing/docker-compose.yml pull
	$(DOCKER_COMPOSE_ENV) docker-compose -f py-payments-testing/docker-compose.yml up -d

docker-compose-down:
	docker-compose -f py-payments-testing/docker-compose.yml down

behave-chrome:
	docker-compose -f py-payments-testing/docker-compose.yml run tests poetry run behave features --tags=$(BEHAVE_TAGS)

behave-browserstack:
	docker-compose -f py-payments-testing/docker-compose.yml run -e OS=$(OS) -e OS_VERSION=$(OS_VERSION) -e BROWSER=$(BROWSER) -e BROWSER_VERSION=$(BROWSER_VERSION) -e BS_ACCESS_KEY=$(BROWSERSTACK_ACCESS_KEY) -e BS_USERNAME=$(BROWSERSTACK_USERNAME) -e BS_LOCAL_IDENTIFIER=$(GITHUB_RUN_ID) -e BUILD_NAME=$(GITHUB_RUN_ID) -e REMOTE=true tests poetry run behave features --tags=$(BEHAVE_TAGS)

browserstack-local-start:
	rm -f ./BrowserStackLocal
	wget https://www.browserstack.com/browserstack-local/BrowserStackLocal-linux-x64.zip
	unzip 'BrowserStackLocal-linux-x64.zip'
	rm 'BrowserStackLocal-linux-x64.zip'
	./BrowserStackLocal --key=$(BROWSERSTACK_ACCESS_KEY) --force-local --daemon start

browserstack-local-stop:
	./BrowserStackLocal --daemon stop
