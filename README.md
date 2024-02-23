![image](https://github.com/cyanff/nyxt/assets/79063400/53286786-40b6-4f08-a78e-689375ee1218)

## What is nyxt.ai?
It's a Chrome extension that allows you to summarize any article.


## Why use nyxt?
Performance and ease of use are at the core of Nyxt.

It's powered NVIDIA® TensorRT LLM, enabling nearly instantaneous summaries.

Nyxt features beautiful, soothing animations as summaries are generated.

![demo](https://github.com/cyanff/nyxt/assets/79063400/5994f301-4884-4d5f-9f4a-261b878b6781)



## A11y
Nyxt is built with accessibility in mind.
- You could increase and decrease font sizes
- You could scale the window to your liking
- Nyxt's typeface of choice is Atkinson Hyperlegible. A font optimized for readability, created by the [Braille Institute](https://brailleinstitute.org/give).



## How to Install Nyxt
I've made every effort to make the installation process as easy as possible.
Here's a Youtube video showcasing how to install Nyxt: https://www.youtube.com/watch?v=QJt7szR6kxw

In *summary* ;)
<details>
  
  <summary>
    Download and run the setup.ps1 powershell script as as administrator. https://www.nyxt.ai/setup.ps1
  </summary>

- This will install all TensorRT LLM dependencies (aside from cuDNN).
- It'll also download the extension, inference server and its required tokenizer and engine. These will be downloaded from huggingface. https://huggingface.co/thisisphan/nyxt
- You could skip any dependencies you already have by using flags when calling the script

Available flags
  ```
  -skipCUDA,
  -skipPython,
  -skipMPI,
  -skipGit,
  -skipLFS
  ```
  
Ex:
`.\setup.ps1 -skipCUDA -skipPython`
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
   

## Gen AI on RTX Contest Info
This project was created for the Nvidia Gen AI on RTX PCs contest.

It's submitted under the **Text-Based Applications** category.

It utilizes TensorRT LLM + Mistral 7b 4bit to allow for nearly instaneous summaries.

https://www.nvidia.com/en-us/ai-data-science/generative-ai/rtx-developer-contest/


### Software Versions
- Windows 10
- TensorRT LLM 0.7.1
- Python 3.10.11
- Cuda 12.2
- cuDNN 8.9.7
- MPI 10.1.1


### Tested Hardware
RTX 4090

However, the engine provided should work on *any* [Ada](https://en.wikipedia.org/wiki/Ada_Lovelace_(microarchitecture)) series GPU.


### Debugging

<details>
  <summary> 
    Powershell installation script failed. 
  </summary>

  You could perform all the steps the installation script goes through manually:
- Install TensorRT LLM dependencies
  - Cuda 12.2
  - Microsoft MPI 10.11.1
  - Python 3.10.11
  - cuDNN 8.9.7
  - TensorRT LLM 0.7.1
- Clone the Nyxt huggingface repo that contains everything needed to install the extension and run the inference server: https://huggingface.co/thisisphan/nyxt
  - Install Git and Git LFS
  - cd into the cloned directory and run `pip install -r requirements.txt`
- Run the inference server with `python server.py` (Be sure to disable Powershell [quick edit](https://stackoverflow.com/questions/30418886/how-and-why-does-quickedit-mode-in-command-prompt-freeze-applications) mode so you don't accidentally pause the inference server!)
- Install the extension
  - Open chrome -> settings -> extension -> manage extensions.
  - Enable developer mode
  - Click on "load unpacked", load the folder named `extension` inside of the nyxt cloned repo.
- Done!

</details>

<details>
  <summary>
    The extension is perma loading.
  </summary>

  This probably is because Powershell [quick edit](https://stackoverflow.com/questions/30418886/how-and-why-does-quickedit-mode-in-command-prompt-freeze-applications) is on and you've accidentally clicked inside the powershell window, which pauses the inference server.
  
  You could right click the powershell window title -> properties -> disable quick edit mode.
  
  Re run the script, refresh the page, and regenerate the summary.
  
</details>


