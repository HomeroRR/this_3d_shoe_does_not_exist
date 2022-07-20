# this_3d_shoe_does_not_exist
3D GAN website for generating 3D models of shoes

## Environment setup

Steps for setting up the environment with [conda](https://conda.io):

```
conda create -n gan python=3.7
conda activate gan
cd machine_learning
pip install -r requirements.txt
conda install pytorch==1.1.0 -c pytorch
```
### Tested on:
* Windows 10+
* Linux Ubuntu 18.04 LTS

## Acknowledgements
This repository is built upon the https://github.com/marian42/shapegan repository which contains the code for the paper "[Adversarial Generation of Continuous Implicit Shape Representations](https://arxiv.org/abs/2002.00349)."