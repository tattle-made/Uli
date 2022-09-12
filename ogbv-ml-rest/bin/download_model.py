
# Logic to download state dict
#from tqdm import tqdm
import requests
import os 

#URL to be downloaded
url = "https://huggingface.co/tattle-admin/july22-xlmtwtroberta-da-multi/resolve/main/pytorch_model.bin"

path = "/app/assets/model_state_dict.bin" #Path to where the model is downloaded
#download the file
if(os.path.isfile(path) == False): #Checking whether the file is already present

     r = requests.get(url, allow_redirects=True, stream = True)

     #save downloaded file

     # os.mkdir('assets')

     os.chdir('assets')

     with open("model_state_dict.bin","wb") as pdf:
          for chunk in (r.iter_content(chunk_size=1024)):
               #  writing one chunk at a time to file named model_state_dict.bin
               if chunk:
                    pdf.write(chunk)

# Note that if you want to update the "model_state_dict.bin" file, you need to remove the volume "ogbv-assets" and rerun the scripts