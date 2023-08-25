import os
import openai
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_KEY")
# print ('value of', os.getenv("OPENAI_KEY"))

# data_path = os.path.expanduser("~/Desktop/messages.jsonl")

# the_file = openai.File.create(file=open(data_path, "rb"), purpose='fine-tune')
# sleep 100 # wait for the file to be processed 
# openai.FineTuningJob.create(training_file=the_file.id, model="gpt-3.5-turbo")

# List up to 10 events from a fine-tuning job
# print(openai.FineTuningJob.list_events(id=the_file.id, limit=1))