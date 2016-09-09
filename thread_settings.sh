#!/bin/bash

# for Getting Started Button
# 
curl -X POST -H "Content-Type: application/json" -d '{
  "setting_type":"call_to_actions",
    "thread_state":"new_thread",
    "call_to_actions":[
    {
              "payload":"안녕하세요! HHbot 이에요."
                  }

    ]

}' "https://graph.facebook.com/v2.6/me/thread_settings?access_token=EAAZAafXETcwABAFz2qNcr1OyWRQukdS0LlNO9MUjbRsOvDgWfp7QcZAg4XaZBVoHJrl2FU5ZAMGo44UmBVRqV8ZCClUwTgXn0Jf4om2JQ8mbBZATzTTIFPOoENG1DW5cYK94I8CtKYnm9yRHSj7BLwQkjnP1Y0ui8W2rdBXvBxiQZDZD"


# for fixed menu
#
curl -X POST -H "Content-Type: application/json" -d '{
  "setting_type" : "call_to_actions",
    "thread_state" : "existing_thread",
    "call_to_actions":[
    {
              "type":"postback",
              "title":"How to",
              "payload": "how_to_postback"
                              
    }
      
    ]

}' "https://graph.facebook.com/v2.6/me/thread_settings?access_token=EAAZAafXETcwABAFz2qNcr1OyWRQukdS0LlNO9MUjbRsOvDgWfp7QcZAg4XaZBVoHJrl2FU5ZAMGo44UmBVRqV8ZCClUwTgXn0Jf4om2JQ8mbBZATzTTIFPOoENG1DW5cYK94I8CtKYnm9yRHSj7BLwQkjnP1Y0ui8W2rdBXvBxiQZDZD"
