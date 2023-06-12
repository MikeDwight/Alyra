# TP No. 02 - Alyra, session Buterin

Ceci est fichier README pour mon projet de test du contrat de voting, voting.sol.

## Introduction

L'instruction du TP No. 01 était de créer un contrat intelligent et le but de ce TP est de tester ce contrat dans le but d'obtenir un taux de couverture de 100%.

## Contenus du projet

- Dans le dossier **'contracts'** se trouve le contrat intelligent **'voting.sol'**
- Dans le dossier **'test'** se trouve le fichier de test **'voting.test.js'**

## Installation et pré-requis

Pour installer et exécuter ce projet localement, suivez ces étapes :

1. Clonez ce dépôt sur votre machine locale.
2. Assurez-vous d'avoir node.js installé sur votre ordinateur.
3. Ouvrez une fenêtre de terminal et naviguez jusqu'au répertoire du projet.

### Hardhat 

1. Installez hardhat avec la commande `npm install hardhat`


## Utilisation

1. Ouvrez le fichier **'voting.test.js'**
2. Lancez la blockchain de test en utilisant `npx hardhat node`
3. Éxécutez la commande `npx hardhat test` pour lancer les tests
4. Pour obtenir les taux de couverture, utilisez la commande `npx hardhat coverage`

**NB : les méthodes 'ethers', 'expect' et 'assert' sont fournis avec l'installation de Hardhat. Les méthodes 'expectRevert' et 'expectEvent' sont disponibles en installant la librairie 'test-helpers' de OpenZeppelin :**
`npm install @openzeppelin/test-helpers`

## Explications

- Pour cet exercice, j'ai éffectué 43 tests pour vérifier le bon fonctionnement des differentes fonctions du contrat 'voting.sol'.
- J'ai utilisé les méthodes 'ethers', 'expect' et 'assert' (librairies ethers et chai) ainsi que la méthode 'expectRevert' (librairie test-helpers).
- Avant chaque test, je créer une instance du contrat 'voting.sol' et je le déploie. Je récupère également 3 comptes de tests pour simuler les transactions.
- Les tests sont organisés en 6 sections que sont : Initialization, Getter, Resgistration, Proposal, Vote et States.

## Auteurs

- Mickael Alves de Carvalho

## Licence

Ce projet est sous licence MIT.

