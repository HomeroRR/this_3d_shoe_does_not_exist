# This 3D shoe does not exist

<div style="display:flex; flex-direction:column;"><img src="https://github.com/HomeroRR/this_3d_shoe_does_not_exist/blob/main/docs/client/branding/3d_shoe_logo.svg" alt="Readgauge logo" height="320"/>
</div>

3D GAN website for generating 3D models of shoes

<img src="https://github.com/HomeroRR/this_3d_shoe_does_not_exist/blob/main/docs/client/screenshots/demo_iPad.png" height="540" alt="Readgauge home page phone mockup"/>  

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
