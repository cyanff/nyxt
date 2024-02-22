# Command-line --options that let you skip unnecessary installations
param (
    [switch]$skipCUDA,
    [switch]$skipPython,
    [switch]$skipMPI,
    [switch]$skipGit,
    [switch]$skipLFS
)

# Set the error action preference to 'Stop' for the entire script.
# Respond to non-terminating errors by stopping execution and displaying an error message.
$ErrorActionPreference = 'Stop'
# Powershell downloads with Invoke-WebRequest is execruciatingly slow without this
$global:progressPreference = 'silentlyContinue'


function Prepend-SystemPath($Path) {
    $systemPath = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::Machine)
    If (-Not $systemPath.Contains($Path)) {
        $newPath = $Path + ";" + $systemPath
        [System.Environment]::SetEnvironmentVariable("Path", $newPath, [System.EnvironmentVariableTarget]::Machine)
    }
}

function Refresh-EnvironmentVariables {
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
}


# ==========================================================================
# Dependencies Installation
# ==========================================================================
Write-Output "Starting dependencies installation"

# Install CUDA 12.2
if (-not ($skipCUDA)) {
    Write-Output "Downloading CUDA 12.2 - this will take a while"
    Invoke-WebRequest -Uri 'https://developer.download.nvidia.com/compute/cuda/12.2.2/local_installers/cuda_12.2.2_537.13_windows.exe' -OutFile 'cuda_installer.exe'
    Write-Output "Installing CUDA 12.2 silently - this will take a while"
    Start-Process -Wait -FilePath 'cuda_installer.exe' -ArgumentList '-s'
    Write-Output "Removing CUDA installer"
    Remove-Item -Path 'cuda_installer.exe' -Force
    Write-Output "Done CUDA installation at 'C:\Program Files\NVIDIA Corporation' and 'C:\Program Files\NVIDIA GPU Computing Toolkit'"
} else {
    Write-Output "Skipping CUDA installation"
}


# Install Python 3.10.11
if (-not ($skipPython)) {
    Write-Output "Downloading Python installer"
    Invoke-WebRequest -Uri 'https://www.python.org/ftp/python/3.10.11/python-3.10.11-amd64.exe' -OutFile 'python-3.10.11.exe'
    Write-Output "Installing Python 3.10 silently and adding to system Path for all users"
    Start-Process -Wait -FilePath 'python-3.10.11.exe' -ArgumentList '/quiet InstallAllUsers=1'
    Write-Output "Removing Python installer"
    Remove-Item -Path 'python-3.10.11.exe' -Force
    $installLocation = "${env:ProgramFiles}\Python310"
    $pythonPath = "$installLocation"
    $scriptsPath = "$installLocation\Scripts"

    Prepend-SystemPath -Path $pythonPath
    Prepend-SystemPath -Path $scriptsPath
    Refresh-EnvironmentVariables
    Write-Output "Done Python installation at 'C:\Program Files\Python310'"
} else {
    Write-Output "Skipping Python installation"
}



# Install Microsoft MPI
if (-not ($skipMPI)) {
    Write-Output "Downloading Microsoft MPI installer"
    Invoke-WebRequest -Uri 'https://github.com/microsoft/Microsoft-MPI/releases/download/v10.1.1/msmpisetup.exe' -OutFile 'msmpisetup.exe'
    Write-Output "Installing Microsoft MPI"
    Start-Process -Wait -FilePath '.\msmpisetup.exe' -ArgumentList '-unattend'
    Write-Output "Removing MPI installer"
    Remove-Item -Path 'msmpisetup.exe' -Force
    Write-Output "Adding MPI to system Path"
    [Environment]::SetEnvironmentVariable('Path', "$env:Path;C:\Program Files\Microsoft MPI\Bin", [EnvironmentVariableTarget]::Machine)
    Write-Output "Downloading Microsoft MPI SDK installer"
    Invoke-WebRequest -Uri 'https://github.com/microsoft/Microsoft-MPI/releases/download/v10.1.1/msmpisdk.msi' -OutFile 'msmpisdk.msi'
    Write-Output "Installing Microsoft MPI SDK"
    Start-Process -Wait -FilePath 'msiexec.exe' -ArgumentList '/I msmpisdk.msi /quiet'
    Write-Output "Removing MPI SDK installer"
    Remove-Item -Path 'msmpisdk.msi' -Force
    Write-Output "Done MPI installation at 'C:\Program Files\Microsoft MPI' and 'C:\Program Files (x86)\Microsoft SDKs\MPI'"
} else {
    Write-Output "Skipping MPI installation"
}


# Install TensorRT LLM
Invoke-Expression "pip install tensorrt_llm==0.7.1 --extra-index-url https://pypi.nvidia.com --extra-index-url https://download.pytorch.org/whl/cu121"


# Install Git 
if (-not ($skipGit)) {
    $gitInstallerUrl = "https://github.com/git-for-windows/git/releases/download/v2.43.0.windows.1/Git-2.43.0-64-bit.exe"
    $gitInstallerPath = "git_installer.exe"
    Write-Host "Git not found. Downloading and installing Git..."
    Invoke-WebRequest -Uri $gitInstallerUrl -OutFile $gitInstallerPath
    Start-Process -FilePath $gitInstallerPath -Args "/VERYSILENT /NORESTART" -Wait
    Remove-Item -Path $gitInstallerPath
    Write-Host "Git installed successfully."
    Refresh-EnvironmentVariables # Refresh environment variables to ensure `git` command is recognized
} else {
    Write-Output "Skipping Git installation"
}


# Install Git LFS
if(-not ($skipLFS)) {
  $gitLfsInstallerUrl = "https://github.com/git-lfs/git-lfs/releases/download/v3.4.1/git-lfs-windows-v3.4.1.exe"
  $gitLfsInstallerPath = "git_lfs_installer.exe"
  # Download and Install Git LFS
  Write-Host "Downloading and installing Git LFS..."
  Invoke-WebRequest -Uri $gitLfsInstallerUrl -OutFile $gitLfsInstallerPath
  Start-Process -FilePath $gitLfsInstallerPath -Args "/VERYSILENT /NORESTART" -Wait
  Remove-Item -Path $gitLfsInstallerPath
  Write-Host "Git LFS installed successfully."
  # Initialize Git LFS
  git lfs install
  Write-Host "Git LFS initialized successfully."
} else {
  Write-Output "Skipping Git installation"
}

Write-Output "Finished dependencies installation"


# ==========================================================================
# Download Nyxt's backend 
# ==========================================================================
Write-Output "Starting Nyxt backend installation"

# Clone repo 
Write-Host "Downloading the Nyxt backend. This might take a while. (~4GB download)"
git clone "https://huggingface.co/thisisphan/nyxt"
Write-Host "Finished downloading backend"
cd nyxt
Write-Host "Installing FastAPI and uvicorn"
pip install -r "requirements.txt"

Write-Host "All done!!"
Write-Host "All you have to do now is download and install cuDNN 8.9.7 from the archive."
Write-Host "Once that's done, go in to nyxt/ and run ``python server.py`` using the command terminal"
