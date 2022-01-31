setup-services:
	cd .\microservices\Access Control && npm install && cd .. && cd .\Helper && npm install && cd .. && cd .\Activities\Multiple Choice Question && npm install && cd .. && cd .. && cd .\Content Pages\Pages && npm install && cd .. && cd .\Phrases && npm install && cd .. && cd .\Text && npm install && cd .. && cd .. && cd .\Lessons && npm install

setup-author-app:
	cd .\author-tool-app && npm install