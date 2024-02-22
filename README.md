![image](https://github.com/cyanff/nyxt/assets/79063400/53286786-40b6-4f08-a78e-689375ee1218)

## What is nyxt.ai?
It's a Chrome extension that allows you to summarize any article.


## Why use nyxt?
Performance and ease of use are at the core of Nyxt.

It's powered NVIDIA® TensorRT LLM, enabling nearly instantaneous summaries.

Nyxt features beautiful, soothing animations as summaries are generated.

![demo](https://github.com/cyanff/nyxt/assets/79063400/5994f301-4884-4d5f-9f4a-261b878b6781)



## A11Y
Nyxt is built with accessibility in mind.
- You could increase and decrease font sizes
- You could scale the window to your liking
- Nyxt's typeface of choice is Atkinson Hyperlegible. A font optimized for readability, created by the [Braille Institute](https://brailleinstitute.org/give).



## How to Install Nyxt
I've made every effort to make the installation process as easy as possible.

In *summary* ;)
<details>
  
  <summary>
    Download and run the setup.ps1 powershell script as as administrator. https://www.nyxt.ai/setup.ps1
  </summary>
  
- This will install all TensorRT LLM dependencies (aside from cuDNN).
- It'll also download the extension, inference server and its required tokenizer and engine. These will be downloaded from huggingface. https://huggingface.co/thisisphan/nyxt
</details>

<details>
  <summary>
    Download and install cuDNN version 8.9.7
  </summary>
  
  - Create an Nvidia developer account.
  - Download cuDNN 8.9.7 zip
  - https://developer.nvidia.com/downloads/compute/cudnn/secure/8.9.7/local_installers/12.x/cudnn-windows-x86_64-8.9.7.29_cuda12-archive.zip/
  - Unzip the file
  - Create a folder named cuDNN at C:\
  - Copy bin/ and lib/ to C:\cuDNN\
  - Add these folders to the system path
  - https://www.architectryan.com/2018/03/17/add-to-the-path-on-windows-10/
  - The paths that you add should be:
    - C:\cudNN\bin
    - C:\cuDNN\lib
</details>

<details>
  <summary>
    Install the extension
  </summary>
  
- Go to chrome extension -> manage extension  
- load unpack
- go to the nyxt/ folder downloaded by `setup.ps1`
- load the nyxt/extension/ folder.
</details>
   
Here's a Youtube video demonstrating the installation and usage: TODO

## Software Versions
- Windows 10
- TensorRT LLM 0.7.1
- Python 3.10.11
- Cuda 12.2
- cuDNN 8.9.7
- MPI 10.1.1


## Tested Hardware
RTX 4090

However, the engine provided should work on *any* [Ada](https://en.wikipedia.org/wiki/Ada_Lovelace_(microarchitecture)) series GPU.
