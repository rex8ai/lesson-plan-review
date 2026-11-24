/*
 * LESSON PLAN TEST DATA
 *
 * To test another API response:
 * 1. Replace the JSON inside response1 or response2 below.
 * 2. Keep the response in its original API shape (the API currently returns an array).
 * 3. Save this file and refresh index.html.
 *
 * You can keep multiple responses and switch between them in the tester.
 */
window.LESSON_PLAN_RESPONSES = {
  response1: [
  {
    "id": "jiuahsf09010h13j109i-0oa-0sdoa",
    "title": "Community Helpers: Who Helps Us?",
    "domainId": "d0a2c33f-8d71-4a99-999d-7a8c710ae72f",
    "ageStart": 2,
    "ageEnd": 3,
    "gradeId": "29846cf5-5adb-4681-a3ac-fb70e72ac428",
    "region": null,
    "boardId": "26a034e7-0bcc-11f1-9afc-0a0d80a5c04d",
    "status": "ACTIVE",
    "recordStatus": true,
    "sections": [
      {
        "localSectionKey": "learning-objective",
        "title": "Learning Objective",
        "description": "[\"Learners will identify and name at least three familiar community helpers, such as a doctor, teacher, police officer, or firefighter.\",\"Learners will match a community helper with one simple tool, place, or helpful action.\"]",
        "order": 1,
        "sectionContents": [],
        "sectionResources": [],
        "sectionPresentations": [],
        "sectionArtifacts": []
      },
      {
        "localSectionKey": "materials-needed",
        "title": "Materials Needed",
        "description": "[\"Prepare simple picture cards or hand-drawn cards showing a doctor, teacher, police officer, and firefighter.\",\"Keep safe classroom objects or paper pictures such as a bandage, book, whistle, toy telephone, water bottle, and cap.\",\"Use chart paper or a clean floor space for placing and matching the cards.\"]",
        "order": 2,
        "sectionContents": [],
        "sectionResources": [
          {
            "label": "Flashcard 1",
            "resourceUrl": "https://worksheet-cg-dev.s3.ap-south-1.amazonaws.com/assets/85d70357-6091-46f0-a88e-a58e67cfe1f6/original/Doctor2.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWEWOF52AHKTAIBKT%2F20261119%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20261119T172334Z&X-Amz-Expires=3600&X-Amz-Signature=0512663102a6a85b1e7df68a9060b896d7b0976f1d8f6e3ea47b9364562c8c4d&X-Amz-SignedHeaders=host&x-id=GetObject",
            "type": "FLASHCARD"
          },
          {
            "label": "Flashcard 2",
            "resourceUrl": "https://worksheet-cg-dev.s3.ap-south-1.amazonaws.com/assets/044097df-b198-4a66-8e80-cb69fbd7e0ca/original/Actor.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWEWOF52AHKTAIBKT%2F20261119%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20261119T172334Z&X-Amz-Expires=3600&X-Amz-Signature=e7cff00b8ebddadeeb7a370f5b832dfa593e4a50aa3c0102927803828292504d&X-Amz-SignedHeaders=host&x-id=GetObject",
            "type": "FLASHCARD"
          },
          {
            "label": "Flashcard 3",
            "resourceUrl": "https://worksheet-cg-dev.s3.ap-south-1.amazonaws.com/assets/08fcf2cf-0ebe-4576-9fe9-cda4613bcd73/original/hospital.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWEWOF52AHKTAIBKT%2F20261119%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20261119T172334Z&X-Amz-Expires=3600&X-Amz-Signature=99f41fccce1c0d33c295721b72b1e30696a3d8bd91fe253161008924490b99b1&X-Amz-SignedHeaders=host&x-id=GetObject",
            "type": "FLASHCARD"
          }
        ],
        "sectionPresentations": [],
        "sectionArtifacts": []
      },
      {
        "localSectionKey": "introduction",
        "title": "Introduction",
        "description": "[\"Show a picture of a doctor and ask, \\\"Who helps us when we feel unwell?\\\"\",\"Show the remaining helper cards one at a time and invite learners to point, look, or say the name if they know it.\",\"Connect the topic with familiar experiences by asking, \\\"Who helps us in our school or neighbourhood?\\\"\"]",
        "order": 3,
        "sectionContents": [],
        "sectionResources": [
          {
            "label": "Flashcard 1",
            "resourceUrl": "https://worksheet-cg-dev.s3.ap-south-1.amazonaws.com/assets/85d70357-6091-46f0-a88e-a58e67cfe1f6/original/Doctor2.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWEWOF52AHKTAIBKT%2F20261119%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20261119T172354Z&X-Amz-Expires=3600&X-Amz-Signature=76024f295e635bcbda7ed62206bea106fc8b05f08bd6ec151d93a00047362522&X-Amz-SignedHeaders=host&x-id=GetObject",
            "type": "FLASHCARD"
          },
          {
            "label": "Flashcard 2",
            "resourceUrl": "https://worksheet-cg-dev.s3.ap-south-1.amazonaws.com/assets/044097df-b198-4a66-8e80-cb69fbd7e0ca/original/Actor.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWEWOF52AHKTAIBKT%2F20261119%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20261119T172355Z&X-Amz-Expires=3600&X-Amz-Signature=99a7a184370101e4162ba3ad336567fe3f5c0bb7518181b4843ba7d1ddff1ad0&X-Amz-SignedHeaders=host&x-id=GetObject",
            "type": "FLASHCARD"
          },
          {
            "label": "Flashcard 3",
            "resourceUrl": "https://worksheet-cg-dev.s3.ap-south-1.amazonaws.com/assets/1fc144ca-985e-4537-8485-dca5bdd0cb1e/original/Firefighter.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWEWOF52AHKTAIBKT%2F20261119%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20261119T172355Z&X-Amz-Expires=3600&X-Amz-Signature=545998533de79a5241ea15bd42765be28aa5fc88b93e1cc7aa0835bf70f19ba9&X-Amz-SignedHeaders=host&x-id=GetObject",
            "type": "FLASHCARD"
          }
        ],
        "sectionPresentations": [],
        "sectionArtifacts": []
      },
      {
        "localSectionKey": "conceptual-understanding",
        "title": "Conceptual Understanding",
        "description": "[\"Place the helper cards where all learners can see them and model one clear connection: \\\"A doctor helps sick people. A doctor may use a bandage.\\\"\",\"Demonstrate the other connections: a teacher uses books, a police officer helps keep people safe, and a firefighter helps during a fire.\",\"Invite learners to copy one helpful action, such as pretending to read, listen to a heartbeat, direct traffic, or spray water safely in the air.\"]",
        "order": 4,
        "sectionContents": [],
        "sectionResources": [
          {
            "label": "Flashcard 1",
            "resourceUrl": "https://worksheet-cg-dev.s3.ap-south-1.amazonaws.com/assets/85d70357-6091-46f0-a88e-a58e67cfe1f6/original/Doctor2.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWEWOF52AHKTAIBKT%2F20261119%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20261119T172412Z&X-Amz-Expires=3600&X-Amz-Signature=31a422a6af12ebc6de1d13d653abd75f948656cd71f33ff3db90d997b008c189&X-Amz-SignedHeaders=host&x-id=GetObject",
            "type": "FLASHCARD"
          },
          {
            "label": "Flashcard 2",
            "resourceUrl": "https://worksheet-cg-dev.s3.ap-south-1.amazonaws.com/assets/1fc144ca-985e-4537-8485-dca5bdd0cb1e/original/Firefighter.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWEWOF52AHKTAIBKT%2F20261119%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20261119T172412Z&X-Amz-Expires=3600&X-Amz-Signature=9ccf075f87b39d187d879eaef5c478c290f04759673be4877354179b414ac915&X-Amz-SignedHeaders=host&x-id=GetObject",
            "type": "FLASHCARD"
          },
          {
            "label": "Flashcard 3",
            "resourceUrl": "https://worksheet-cg-dev.s3.ap-south-1.amazonaws.com/assets/044097df-b198-4a66-8e80-cb69fbd7e0ca/original/Actor.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWEWOF52AHKTAIBKT%2F20261119%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20261119T172412Z&X-Amz-Expires=3600&X-Amz-Signature=39644c7edf4d198f89f468a421803c343d2feff72711e535e8ec9a65fb7281fa&X-Amz-SignedHeaders=host&x-id=GetObject",
            "type": "FLASHCARD"
          }
        ],
        "sectionPresentations": [],
        "sectionArtifacts": []
      },
      {
        "localSectionKey": "practice-application",
        "title": "Practice & Application",
        "description": "[\"Spread the helper cards and object or tool pictures on the floor in mixed order.\",\"Invite each learner to choose one object or picture and place it beside the helper who may use it or do that helpful action.\",\"Support learners with choices and gestures, accepting pointing, matching, words, or home-language responses as meaningful participation.\"]",
        "order": 5,
        "sectionContents": [],
        "sectionResources": [
          {
            "label": "Flashcard 1",
            "resourceUrl": "https://worksheet-cg-dev.s3.ap-south-1.amazonaws.com/assets/85d70357-6091-46f0-a88e-a58e67cfe1f6/original/Doctor2.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWEWOF52AHKTAIBKT%2F20261119%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20261119T172425Z&X-Amz-Expires=3600&X-Amz-Signature=42cb76eb578212a119c7b3b0e534d2f9d33d5dd867350180d074773782b0147d&X-Amz-SignedHeaders=host&x-id=GetObject",
            "type": "FLASHCARD"
          },
          {
            "label": "Flashcard 2",
            "resourceUrl": "https://worksheet-cg-dev.s3.ap-south-1.amazonaws.com/assets/1fc144ca-985e-4537-8485-dca5bdd0cb1e/original/Firefighter.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWEWOF52AHKTAIBKT%2F20261119%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20261119T172425Z&X-Amz-Expires=3600&X-Amz-Signature=4a928711b61ade3b0f5570a4e13a4706f98633d4bcc029a1a2092b56861093d8&X-Amz-SignedHeaders=host&x-id=GetObject",
            "type": "FLASHCARD"
          },
          {
            "label": "Flashcard 3",
            "resourceUrl": "https://worksheet-cg-dev.s3.ap-south-1.amazonaws.com/assets/044097df-b198-4a66-8e80-cb69fbd7e0ca/original/Actor.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWEWOF52AHKTAIBKT%2F20261119%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20261119T172425Z&X-Amz-Expires=3600&X-Amz-Signature=17c36401655385830e2ef320dad34db4cf7070f409d09f2d47abbb9a9d4bc502&X-Amz-SignedHeaders=host&x-id=GetObject",
            "type": "FLASHCARD"
          }
        ],
        "sectionPresentations": [],
        "sectionArtifacts": []
      },
      {
        "localSectionKey": "sharing-expansion",
        "title": "Sharing & Expansion",
        "description": "[\"Invite learners to choose one helper card and pretend to be that helper for a few moments using a safe classroom object.\",\"Each learner may show the action while the educator names it, for example, \\\"Riya is helping like a doctor.\\\"\",\"Close by reminding learners that community helpers work to help people and that learners can also help by keeping toys away, listening, and being kind.\"]",
        "order": 6,
        "sectionContents": [],
        "sectionResources": [
          {
            "label": "Flashcard 1",
            "resourceUrl": "https://worksheet-cg-dev.s3.ap-south-1.amazonaws.com/assets/85d70357-6091-46f0-a88e-a58e67cfe1f6/original/Doctor2.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWEWOF52AHKTAIBKT%2F20261119%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20261119T172433Z&X-Amz-Expires=3600&X-Amz-Signature=b36746da866c9b33ba003df718ef43773c2a2d68e44712cd2bd8917889e0eafb&X-Amz-SignedHeaders=host&x-id=GetObject",
            "type": "FLASHCARD"
          },
          {
            "label": "Flashcard 2",
            "resourceUrl": "https://worksheet-cg-dev.s3.ap-south-1.amazonaws.com/assets/1fc144ca-985e-4537-8485-dca5bdd0cb1e/original/Firefighter.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWEWOF52AHKTAIBKT%2F20261119%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20261119T172433Z&X-Amz-Expires=3600&X-Amz-Signature=a139663c00b2fe93c020be03413b58ed8016f2bf2b86e611577bcc29bf2f8877&X-Amz-SignedHeaders=host&x-id=GetObject",
            "type": "FLASHCARD"
          },
          {
            "label": "Flashcard 3",
            "resourceUrl": "https://worksheet-cg-dev.s3.ap-south-1.amazonaws.com/assets/044097df-b198-4a66-8e80-cb69fbd7e0ca/original/Actor.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWEWOF52AHKTAIBKT%2F20261119%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20261119T172433Z&X-Amz-Expires=3600&X-Amz-Signature=7fbe4eec7e9dbfc6ff70f1074c9ad57de6b21842b7c84916e95ba05b49945b11&X-Amz-SignedHeaders=host&x-id=GetObject",
            "type": "FLASHCARD"
          }
        ],
        "sectionPresentations": [],
        "sectionArtifacts": []
      }
    ],
    "schedules": [
      {
        "unit": 1,
        "day": 2,
        "week": 1,
        "index": null,
        "term": null
      }
    ],
    "branchId": "835c5175-fdc3-4610-ad88-6ddf9441f893",
    "lessonContents": [],
    "lessonArtifacts": [],
    "lessonPlanPresentations": [],
    "resources": [
      {
        "label": "Community helpers for preschool",
        "resourceUrl": "https://www.youtube.com/results?search_query=Community+helpers+for+preschool",
        "type": "EXTERNAL_RESOURCES"
      },
      {
        "label": "Community helper role play for toddlers",
        "resourceUrl": "https://www.youtube.com/results?search_query=Community+helper+role+play+for+toddlers",
        "type": "EXTERNAL_RESOURCES"
      },
      {
        "label": "Flashcard 1",
        "resourceUrl": "https://worksheet-cg-dev.s3.ap-south-1.amazonaws.com/assets/85d70357-6091-46f0-a88e-a58e67cfe1f6/original/Doctor2.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWEWOF52AHKTAIBKT%2F20261119%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20261119T172334Z&X-Amz-Expires=3600&X-Amz-Signature=0512663102a6a85b1e7df68a9060b896d7b0976f1d8f6e3ea47b9364562c8c4d&X-Amz-SignedHeaders=host&x-id=GetObject",
        "type": "FLASHCARD"
      },
      {
        "label": "Flashcard 2",
        "resourceUrl": "https://worksheet-cg-dev.s3.ap-south-1.amazonaws.com/assets/044097df-b198-4a66-8e80-cb69fbd7e0ca/original/Actor.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWEWOF52AHKTAIBKT%2F20261119%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20261119T172334Z&X-Amz-Expires=3600&X-Amz-Signature=e7cff00b8ebddadeeb7a370f5b832dfa593e4a50aa3c0102927803828292504d&X-Amz-SignedHeaders=host&x-id=GetObject",
        "type": "FLASHCARD"
      },
      {
        "label": "Flashcard 3",
        "resourceUrl": "https://worksheet-cg-dev.s3.ap-south-1.amazonaws.com/assets/08fcf2cf-0ebe-4576-9fe9-cda4613bcd73/original/hospital.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWEWOF52AHKTAIBKT%2F20261119%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20261119T172334Z&X-Amz-Expires=3600&X-Amz-Signature=99f41fccce1c0d33c295721b72b1e30696a3d8bd91fe253161008924490b99b1&X-Amz-SignedHeaders=host&x-id=GetObject",
        "type": "FLASHCARD"
      },
      {
        "label": "Flashcard 4",
        "resourceUrl": "https://worksheet-cg-dev.s3.ap-south-1.amazonaws.com/assets/85d70357-6091-46f0-a88e-a58e67cfe1f6/original/Doctor2.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWEWOF52AHKTAIBKT%2F20261119%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20261119T172354Z&X-Amz-Expires=3600&X-Amz-Signature=76024f295e635bcbda7ed62206bea106fc8b05f08bd6ec151d93a00047362522&X-Amz-SignedHeaders=host&x-id=GetObject",
        "type": "FLASHCARD"
      },
      {
        "label": "Flashcard 5",
        "resourceUrl": "https://worksheet-cg-dev.s3.ap-south-1.amazonaws.com/assets/044097df-b198-4a66-8e80-cb69fbd7e0ca/original/Actor.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWEWOF52AHKTAIBKT%2F20261119%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20261119T172355Z&X-Amz-Expires=3600&X-Amz-Signature=99a7a184370101e4162ba3ad336567fe3f5c0bb7518181b4843ba7d1ddff1ad0&X-Amz-SignedHeaders=host&x-id=GetObject",
        "type": "FLASHCARD"
      },
      {
        "label": "Flashcard 6",
        "resourceUrl": "https://worksheet-cg-dev.s3.ap-south-1.amazonaws.com/assets/1fc144ca-985e-4537-8485-dca5bdd0cb1e/original/Firefighter.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWEWOF52AHKTAIBKT%2F20261119%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20261119T172355Z&X-Amz-Expires=3600&X-Amz-Signature=545998533de79a5241ea15bd42765be28aa5fc88b93e1cc7aa0835bf70f19ba9&X-Amz-SignedHeaders=host&x-id=GetObject",
        "type": "FLASHCARD"
      },
      {
        "label": "Flashcard 7",
        "resourceUrl": "https://worksheet-cg-dev.s3.ap-south-1.amazonaws.com/assets/85d70357-6091-46f0-a88e-a58e67cfe1f6/original/Doctor2.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWEWOF52AHKTAIBKT%2F20261119%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20261119T172412Z&X-Amz-Expires=3600&X-Amz-Signature=31a422a6af12ebc6de1d13d653abd75f948656cd71f33ff3db90d997b008c189&X-Amz-SignedHeaders=host&x-id=GetObject",
        "type": "FLASHCARD"
      },
      {
        "label": "Flashcard 8",
        "resourceUrl": "https://worksheet-cg-dev.s3.ap-south-1.amazonaws.com/assets/1fc144ca-985e-4537-8485-dca5bdd0cb1e/original/Firefighter.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWEWOF52AHKTAIBKT%2F20261119%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20261119T172412Z&X-Amz-Expires=3600&X-Amz-Signature=9ccf075f87b39d187d879eaef5c478c290f04759673be4877354179b414ac915&X-Amz-SignedHeaders=host&x-id=GetObject",
        "type": "FLASHCARD"
      },
      {
        "label": "Flashcard 9",
        "resourceUrl": "https://worksheet-cg-dev.s3.ap-south-1.amazonaws.com/assets/044097df-b198-4a66-8e80-cb69fbd7e0ca/original/Actor.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWEWOF52AHKTAIBKT%2F20261119%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20261119T172412Z&X-Amz-Expires=3600&X-Amz-Signature=39644c7edf4d198f89f468a421803c343d2feff72711e535e8ec9a65fb7281fa&X-Amz-SignedHeaders=host&x-id=GetObject",
        "type": "FLASHCARD"
      },
      {
        "label": "Flashcard 10",
        "resourceUrl": "https://worksheet-cg-dev.s3.ap-south-1.amazonaws.com/assets/85d70357-6091-46f0-a88e-a58e67cfe1f6/original/Doctor2.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWEWOF52AHKTAIBKT%2F20261119%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20261119T172425Z&X-Amz-Expires=3600&X-Amz-Signature=42cb76eb578212a119c7b3b0e534d2f9d33d5dd867350180d074773782b0147d&X-Amz-SignedHeaders=host&x-id=GetObject",
        "type": "FLASHCARD"
      },
      {
        "label": "Flashcard 11",
        "resourceUrl": "https://worksheet-cg-dev.s3.ap-south-1.amazonaws.com/assets/1fc144ca-985e-4537-8485-dca5bdd0cb1e/original/Firefighter.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWEWOF52AHKTAIBKT%2F20261119%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20261119T172425Z&X-Amz-Expires=3600&X-Amz-Signature=4a928711b61ade3b0f5570a4e13a4706f98633d4bcc029a1a2092b56861093d8&X-Amz-SignedHeaders=host&x-id=GetObject",
        "type": "FLASHCARD"
      },
      {
        "label": "Flashcard 12",
        "resourceUrl": "https://worksheet-cg-dev.s3.ap-south-1.amazonaws.com/assets/044097df-b198-4a66-8e80-cb69fbd7e0ca/original/Actor.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWEWOF52AHKTAIBKT%2F20261119%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20261119T172425Z&X-Amz-Expires=3600&X-Amz-Signature=17c36401655385830e2ef320dad34db4cf7070f409d09f2d47abbb9a9d4bc502&X-Amz-SignedHeaders=host&x-id=GetObject",
        "type": "FLASHCARD"
      },
      {
        "label": "Flashcard 13",
        "resourceUrl": "https://worksheet-cg-dev.s3.ap-south-1.amazonaws.com/assets/85d70357-6091-46f0-a88e-a58e67cfe1f6/original/Doctor2.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWEWOF52AHKTAIBKT%2F20261119%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20261119T172433Z&X-Amz-Expires=3600&X-Amz-Signature=b36746da866c9b33ba003df718ef43773c2a2d68e44712cd2bd8917889e0eafb&X-Amz-SignedHeaders=host&x-id=GetObject",
        "type": "FLASHCARD"
      },
      {
        "label": "Flashcard 14",
        "resourceUrl": "https://worksheet-cg-dev.s3.ap-south-1.amazonaws.com/assets/1fc144ca-985e-4537-8485-dca5bdd0cb1e/original/Firefighter.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWEWOF52AHKTAIBKT%2F20261119%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20261119T172433Z&X-Amz-Expires=3600&X-Amz-Signature=a139663c00b2fe93c020be03413b58ed8016f2bf2b86e611577bcc29bf2f8877&X-Amz-SignedHeaders=host&x-id=GetObject",
        "type": "FLASHCARD"
      },
      {
        "label": "Flashcard 15",
        "resourceUrl": "https://worksheet-cg-dev.s3.ap-south-1.amazonaws.com/assets/044097df-b198-4a66-8e80-cb69fbd7e0ca/original/Actor.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAWEWOF52AHKTAIBKT%2F20261119%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20261119T172433Z&X-Amz-Expires=3600&X-Amz-Signature=7fbe4eec7e9dbfc6ff70f1074c9ad57de6b21842b7c84916e95ba05b49945b11&X-Amz-SignedHeaders=host&x-id=GetObject",
        "type": "FLASHCARD"
      }
    ],
    "description": "A 30-minute play-based General Awareness lesson in which nursery learners recognise familiar community helpers, match them with simple tools or actions, and participate in inclusive pretend play."
  }
],
  response2: [
  {
    "id": "jiuahsf09010h13j109i-0oa-0sdoa",
    "title": "Community Helpers: A Visit to Helper Town",
    "domainId": "d0a2c33f-8d71-4a99-999d-7a8c710ae72f",
    "ageStart": 3,
    "ageEnd": 4,
    "gradeId": "29846cf5-5adb-4681-a3ac-fb70e72ac428",
    "region": null,
    "boardId": "26a034e7-0bcc-11f1-9afc-0a0d80a5c04d",
    "status": "ACTIVE",
    "recordStatus": true,
    "sections": [
      {
        "localSectionKey": "learning-objective",
        "title": "Learning Objective",
        "description": "[\"Learners will identify and name at least three community helpers, such as a doctor, teacher, firefighter, or police officer.\",\"Learners will connect at least two community helpers with what they do or the tool they use through picture matching and role play.\"]",
        "order": 1,
        "sectionContents": [],
        "sectionResources": [],
        "sectionPresentations": [],
        "sectionArtifacts": []
      },
      {
        "localSectionKey": "materials-needed",
        "title": "Materials Needed",
        "description": "[\"1 chart-paper drawing of Helper Town with a clinic, school, fire station, police station, and shop — Introduction and Sharing & Expansion; substitute: five labelled areas drawn on the classroom floor with chalk.\",\"8 community-helper picture cards showing a doctor, teacher, firefighter, police officer, nurse, post worker, sanitation worker, and shopkeeper — Introduction and Conceptual Understanding; substitute: hand-drawn helper pictures on reused cardboard.\",\"8 paper helper badges with the same eight helper names and pictures — Practice & Application; substitute: small paper slips with helper names and simple symbols.\",\"8 paper tool cards showing a stethoscope, book, fire hose, whistle, medicine bottle, letter, broom, and shopping bag — Conceptual Understanding and Practice & Application; substitute: simple drawings of the tools on scrap paper.\",\"1 cardboard telephone cutout — Practice & Application; substitute: a clean empty soap box shaped like a telephone.\",\"1 cloth bag labelled Helper Town — Introduction and Sharing & Expansion; substitute: a clean paper bag.\"]",
        "order": 2,
        "sectionContents": [],
        "sectionResources": [
          {
            "label": "Flashcard 1",
            "resourceUrl": "https://dev-cdn.creativegalileo.com/media/ai_flashcards/2026-11-23/image/ca44ba90-83bc-46b5-a290-b20a52e62d32/community_helpers_visit_to_helper_town_g_0_card_1_ae0ed36f_c594170d7460.png",
            "type": "FLASHCARD"
          },
          {
            "label": "Flashcard 2",
            "resourceUrl": "https://dev-cdn.creativegalileo.com/media/ai_flashcards/2026-11-23/image/f51109e7-28d5-43f5-82c4-b52df41e7977/community_helpers_visit_to_helper_town_g_0_card_2_0bd0d4e8_cc49339ddd56.png",
            "type": "FLASHCARD"
          },
          {
            "label": "Flashcard 3",
            "resourceUrl": "https://dev-cdn.creativegalileo.com/media/ai_flashcards/2026-11-23/image/3ce90a9d-e456-4dcf-97fd-ee9664fee831/community_helpers_visit_to_helper_town_g_0_card_3_5d50dc39_1a470619c042.png",
            "type": "FLASHCARD"
          }
        ],
        "sectionPresentations": [],
        "sectionArtifacts": []
      },
      {
        "localSectionKey": "introduction",
        "title": "Introduction",
        "description": "[\"Activity: Who Visits Helper Town? (~5 min) — awaken curiosity and activate familiar knowledge about people who help the community. Thread: introduces Helper Town, which learners will visit and develop throughout the lesson.\",\"Setup: 1 cloth bag labelled Helper Town and 8 community-helper picture cards from Materials Needed; learners sit in a circle near the 1 chart-paper drawing of Helper Town.\",\"Step 1 — Educator: Holds the 1 cloth bag labelled Helper Town and says, \\\"A special town needs our help today. Who might live and work in Helper Town?\\\"\",\"Step 2 — Learners: Look at the bag, share a helper name they know, or point to a familiar helper picture when invited.\",\"Step 3 — Educator: Takes one of the 8 community-helper picture cards from the bag, names the helper clearly, and places it beside the matching area on the 1 chart-paper drawing of Helper Town.\",\"Step 4 — Learners: Repeat the helper name and make a simple action, such as pretending to teach, sweep, or drive, to show what that helper may do.\",\"Questions to ask: \\\"Who helps us when we are sick?\\\" \\\"Who helps us learn?\\\"\",\"Support/Inclusion: Accept pointing, gestures, home-language names, or single-word responses; offer a choice between two community-helper picture cards to a learner who needs support, and invite a ready learner to explain one helper's work.\",\"Wrap-up/Check: Each learner identifies or points to one community-helper picture card; the educator keeps the cards beside Helper Town and transitions to discovering each helper's tool.\"]",
        "order": 3,
        "sectionContents": [],
        "sectionResources": [],
        "sectionPresentations": [],
        "sectionArtifacts": []
      },
      {
        "localSectionKey": "conceptual-understanding",
        "title": "Conceptual Understanding",
        "description": "[\"Activity: Helper and Tool Match (~7 min) — build understanding that different community helpers perform different jobs and use particular tools. Thread: continues the Helper Town visit by giving each helper the tool needed for work.\",\"Setup: 8 community-helper picture cards and 8 paper tool cards from Materials Needed; place the cards face up in two rows, with learners seated in a semicircle.\",\"Step 1 — Educator: Picks up the doctor community-helper picture card and the stethoscope paper tool card, places them together, and says, \\\"The doctor uses a stethoscope to listen to a person's heartbeat.\\\"\",\"Step 2 — Learners: Choose one paper tool card and place it beside the community-helper picture card they think uses it, with educator support for safe and respectful matching.\",\"Step 3 — Educator: Demonstrates two more matches, such as the teacher with the book and the sanitation worker with the broom, while saying what each helper does.\",\"Step 4 — Learners: Say or repeat a short sentence such as, \\\"The teacher uses a book,\\\" and show the matching pair to the group.\",\"Questions to ask: \\\"Which tool can the teacher use?\\\" \\\"Who may use the broom to keep places clean?\\\"\",\"Support/Inclusion: Give a learner two clearly different choices and model the sentence slowly; extend a ready learner by asking, \\\"What work does this helper do for our community?\\\"\",\"Wrap-up/Check: Learners correctly match at least two community-helper picture cards with paper tool cards; the educator gathers the matched cards and transitions to acting as helpers.\"]",
        "order": 4,
        "sectionContents": [],
        "sectionResources": [
          {
            "label": "Flashcard 1",
            "resourceUrl": "https://dev-cdn.creativegalileo.com/media/ai_flashcards/2026-11-23/image/9c0b55d8-789b-46e4-a472-ec9f0bb9276b/community_helpers_visit_to_helper_town_g_0_card_1_eb1973d3_3f17641d5ef3.png",
            "type": "FLASHCARD"
          },
          {
            "label": "Flashcard 2",
            "resourceUrl": "https://dev-cdn.creativegalileo.com/media/ai_flashcards/2026-11-23/image/815dc014-37d1-454b-9c23-96da504a0caf/community_helpers_visit_to_helper_town_g_0_card_2_d96a74e0_a1121746f55a.png",
            "type": "FLASHCARD"
          }
        ],
        "sectionPresentations": [],
        "sectionArtifacts": []
      },
      {
        "localSectionKey": "practice-application",
        "title": "Practice & Application",
        "description": "[\"Activity: Helper Telephone Calls (~10 min) — let learners use helper names, tools, and actions in simple role play. Thread: learners become Helper Town workers and respond to a pretend community call.\",\"Setup: 8 paper helper badges, 8 paper tool cards, and 1 cardboard telephone cutout from Materials Needed; place the badges and tool cards in the centre while learners sit in a circle.\",\"Step 1 — Educator: Holds the 1 cardboard telephone cutout and says, \\\"Helper Town is calling. I need a helper who can help me learn,\\\" then displays the teacher paper helper badge and book paper tool card.\",\"Step 2 — Learners: One learner chooses the teacher paper helper badge, takes the book paper tool card, and pretends to teach while the group says, \\\"Thank you, teacher.\\\"\",\"Step 3 — Educator: Makes another pretend call with the 1 cardboard telephone cutout, saying, \\\"I need someone to help keep our street clean,\\\" and guides learners to notice the sanitation worker paper helper badge and broom paper tool card.\",\"Step 4 — Learners: Take turns choosing an appropriate paper helper badge and paper tool card, name the helper with support, and act out one safe action connected to the helper's work.\",\"Questions to ask: \\\"Who can help when there is a fire?\\\" \\\"Which helper uses the letter paper tool card?\\\"\",\"Support/Inclusion: Allow a learner to act with a peer or point to the correct badge instead of speaking; extend a ready learner by inviting them to make a pretend call and describe the helper's job.\",\"Wrap-up/Check: Each learner participates by naming, pointing to, or acting as one community helper; the educator collects the 8 paper helper badges and 8 paper tool cards before the final Helper Town sharing.\"]",
        "order": 5,
        "sectionContents": [],
        "sectionResources": [],
        "sectionPresentations": [],
        "sectionArtifacts": []
      },
      {
        "localSectionKey": "sharing-expansion",
        "title": "Sharing & Expansion",
        "description": "[\"Activity: Our Thank-You Visit to Helper Town (~8 min) — consolidate learning by placing helpers in their community spaces and expressing appreciation. Thread: closes the Helper Town visit with learners showing how helpers make the town safe, healthy, clean, and ready for learning.\",\"Setup: 1 chart-paper drawing of Helper Town, 8 community-helper picture cards, and 1 cloth bag labelled Helper Town from Materials Needed; learners sit in a semicircle with the town drawing visible.\",\"Step 1 — Educator: Places the 1 chart-paper drawing of Helper Town in the centre and says, \\\"Let us send each helper to the right place and thank them for helping our town.\\\"\",\"Step 2 — Learners: Take turns selecting one of the 8 community-helper picture cards, naming or pointing to the helper, and placing the card near the matching town area.\",\"Step 3 — Educator: Summarises each placement in simple language, such as, \\\"The teacher helps us learn at school,\\\" and models the phrase, \\\"Thank you, helper.\\\"\",\"Step 4 — Learners: Repeat \\\"Thank you, helper,\\\" or show appreciation through a wave, smile, or gesture, then place the remaining community-helper picture cards beside the 1 cloth bag labelled Helper Town.\",\"Questions to ask: \\\"Which helper keeps us healthy?\\\" \\\"Which helper helps us learn?\\\"\",\"Support/Inclusion: Let learners place a card with hand-over-hand guidance or beside a peer, and accept gestures or home-language responses; invite a ready learner to say one way a helper supports the community.\",\"Wrap-up/Check: Learners identify at least three community helpers and connect at least two with their work or place in Helper Town; the educator concludes, \\\"Helpers work together to care for everyone,\\\" and thanks the learners for completing the town visit.\"]",
        "order": 6,
        "sectionContents": [],
        "sectionResources": [
          {
            "label": "Flashcard 1",
            "resourceUrl": "https://dev-cdn.creativegalileo.com/media/ai_flashcards/2026-11-23/image/ac40b0ff-9b1c-4877-8b0e-f780645b50e6/community_helpers_visit_to_helper_town_g_0_card_1_17ee2905_af1c56890747.png",
            "type": "FLASHCARD"
          },
          {
            "label": "Flashcard 2",
            "resourceUrl": "https://dev-cdn.creativegalileo.com/media/ai_flashcards/2026-11-23/image/ffd8b024-9139-4068-addd-52ec0b4f7151/community_helpers_visit_to_helper_town_g_0_card_2_45ac8ae7_ac373ac3011f.png",
            "type": "FLASHCARD"
          },
          {
            "label": "Flashcard 3",
            "resourceUrl": "https://dev-cdn.creativegalileo.com/media/ai_flashcards/2026-11-23/image/f696b785-99ab-4640-94e1-f71205b27d96/community_helpers_visit_to_helper_town_g_0_card_3_d7b6c5d5_d5687762bb91.png",
            "type": "FLASHCARD"
          }
        ],
        "sectionPresentations": [],
        "sectionArtifacts": []
      }
    ],
    "schedules": [
      {
        "unit": 1,
        "day": 2,
        "week": 1,
        "index": null,
        "term": null
      }
    ],
    "branchId": "835c5175-fdc3-4610-ad88-6ddf9441f893",
    "lessonContents": [],
    "lessonArtifacts": [],
    "lessonPlanPresentations": [],
    "resources": [
      {
        "label": "Community helpers for preschool learners",
        "resourceUrl": "https://www.youtube.com/results?search_query=Community+helpers+for+preschool+learners",
        "type": "EXTERNAL_RESOURCES"
      },
      {
        "label": "Flashcard 1",
        "resourceUrl": "https://dev-cdn.creativegalileo.com/media/ai_flashcards/2026-11-23/image/ca44ba90-83bc-46b5-a290-b20a52e62d32/community_helpers_visit_to_helper_town_g_0_card_1_ae0ed36f_c594170d7460.png",
        "type": "FLASHCARD"
      },
      {
        "label": "Flashcard 2",
        "resourceUrl": "https://dev-cdn.creativegalileo.com/media/ai_flashcards/2026-11-23/image/f51109e7-28d5-43f5-82c4-b52df41e7977/community_helpers_visit_to_helper_town_g_0_card_2_0bd0d4e8_cc49339ddd56.png",
        "type": "FLASHCARD"
      },
      {
        "label": "Flashcard 3",
        "resourceUrl": "https://dev-cdn.creativegalileo.com/media/ai_flashcards/2026-11-23/image/3ce90a9d-e456-4dcf-97fd-ee9664fee831/community_helpers_visit_to_helper_town_g_0_card_3_5d50dc39_1a470619c042.png",
        "type": "FLASHCARD"
      },
      {
        "label": "Flashcard 4",
        "resourceUrl": "https://dev-cdn.creativegalileo.com/media/ai_flashcards/2026-11-23/image/9c0b55d8-789b-46e4-a472-ec9f0bb9276b/community_helpers_visit_to_helper_town_g_0_card_1_eb1973d3_3f17641d5ef3.png",
        "type": "FLASHCARD"
      },
      {
        "label": "Flashcard 5",
        "resourceUrl": "https://dev-cdn.creativegalileo.com/media/ai_flashcards/2026-11-23/image/815dc014-37d1-454b-9c23-96da504a0caf/community_helpers_visit_to_helper_town_g_0_card_2_d96a74e0_a1121746f55a.png",
        "type": "FLASHCARD"
      },
      {
        "label": "Flashcard 6",
        "resourceUrl": "https://dev-cdn.creativegalileo.com/media/ai_flashcards/2026-11-23/image/ac40b0ff-9b1c-4877-8b0e-f780645b50e6/community_helpers_visit_to_helper_town_g_0_card_1_17ee2905_af1c56890747.png",
        "type": "FLASHCARD"
      },
      {
        "label": "Flashcard 7",
        "resourceUrl": "https://dev-cdn.creativegalileo.com/media/ai_flashcards/2026-11-23/image/ffd8b024-9139-4068-addd-52ec0b4f7151/community_helpers_visit_to_helper_town_g_0_card_2_45ac8ae7_ac373ac3011f.png",
        "type": "FLASHCARD"
      },
      {
        "label": "Flashcard 8",
        "resourceUrl": "https://dev-cdn.creativegalileo.com/media/ai_flashcards/2026-11-23/image/f696b785-99ab-4640-94e1-f71205b27d96/community_helpers_visit_to_helper_town_g_0_card_3_d7b6c5d5_d5687762bb91.png",
        "type": "FLASHCARD"
      }
    ],
    "description": "Lesson thread: Helper Town — learners visit a pretend town, meet community helpers, match their tools, act out their work, and share appreciation."
  }],
  response3: [
    {
        "id": "jiuahsf09010h13j109i-0oa-0sdoa",
        "title": "Community Helpers in Helper Town",
        "domainId": "d0a2c33f-8d71-4a99-999d-7a8c710ae72f",
        "ageStart": 3,
        "ageEnd": 4,
        "gradeId": "29846cf5-5adb-4681-a3ac-fb70e72ac428",
        "region": null,
        "boardId": "26a034e7-0bcc-11f1-9afc-0a0d80a5c04d",
        "status": "ACTIVE",
        "recordStatus": true,
        "sections": [
            {
                "localSectionKey": "learning-objective",
                "title": "Learning Objective",
                "description": "[\"Learners will name and identify at least three community helpers from picture cards, such as a doctor, firefighter, police officer, and gardener.\",\"Learners will match at least three community helpers with their work tools and show one helpful action through simple role play.\"]",
                "order": 1,
                "sectionContents": [],
                "sectionResources": [
                    {
                        "label": "Flashcard 1",
                        "resourceUrl": "https://dev-cdn.creativegalileo.com/media/ai_flashcards/2026-11-23/image/2d7ae4d2-99f1-4bc8-a352-dff9c53e3458/community_helpers_helper_town_general_aw_0_card_1_631cb20c_574ea5cfc3f6.png",
                        "type": "FLASHCARD"
                    },
                    {
                        "label": "Flashcard 2",
                        "resourceUrl": "https://dev-cdn.creativegalileo.com/media/ai_flashcards/2026-11-23/image/3fdf68d7-093e-4ca6-a737-722ae57fd306/community_helpers_helper_town_general_aw_0_card_2_3326ee45_466b230c54a2.png",
                        "type": "FLASHCARD"
                    }
                ],
                "sectionPresentations": [],
                "sectionArtifacts": []
            },
            {
                "localSectionKey": "materials-needed",
                "title": "Materials Needed",
                "description": "[\"1 small cloth bag labelled Helper Town\",\"4 community-helper picture cards (doctor, firefighter, police officer, gardener)\",\"4 tool picture cards (stethoscope, hose, whistle, watering can)\",\"4 paper helper badges (doctor, firefighter, police officer, gardener)\",\"1 sheet of chart paper with four helper spaces\",\"8 crayons (red, blue, green, yellow)\"]",
                "order": 2,
                "sectionContents": [],
                "sectionResources": [],
                "sectionPresentations": [],
                "sectionArtifacts": []
            },
            {
                "localSectionKey": "introduction",
                "title": "Introduction",
                "description": "[\"Activity: Who Is Visiting Helper Town? (~5 min) — awaken familiar knowledge about people who help the community. Thread: the Helper Town bag opens the lesson and introduces the visiting helpers.\",\"Setup: Keep 1 small cloth bag labelled Helper Town and 4 community-helper picture cards (doctor, firefighter, police officer, gardener) ready; learners sit in a circle.\",\"Step 1 — Educator: Holds 1 small cloth bag labelled Helper Town and says, \\\"Helper Town is waiting for us. Who might be inside the bag?\\\" The bag creates curiosity and gives the lesson one shared story.\",\"Step 2 — Learners: Look at the 1 small cloth bag labelled Helper Town and name a familiar person who helps at home or in the neighbourhood.\",\"Step 3 — Educator: Slowly removes the doctor picture card from the 4 community-helper picture cards and says, \\\"A doctor helps people feel better. Who has seen a doctor?\\\" The picture card connects the spoken role to a clear image.\",\"Step 4 — Learners: Point to the doctor picture card and share a short experience or make a caring gesture with their hands.\",\"Step 5 — Educator: Shows the firefighter, police officer, and gardener picture cards from the 4 community-helper picture cards, names each helper clearly, and invites learners to repeat the names.\",\"Questions to ask: \\\"Who helps when someone is ill?\\\" \\\"Who helps plants grow?\\\"\",\"Support/Inclusion: Accept home-language names first and repeat the English name while pointing to the matching community-helper picture card; let a learner who is shy answer by pointing or copying a peer.\",\"Wrap-up/Check: Each learner points to or names one of the 4 community-helper picture cards; the educator places the 4 community-helper picture cards beside the 1 small cloth bag labelled Helper Town for the next activity.\"]",
                "order": 3,
                "sectionContents": [],
                "sectionResources": [
                    {
                        "label": "Flashcard 1",
                        "resourceUrl": "https://dev-cdn.creativegalileo.com/media/ai_flashcards/2026-11-23/image/f5b9f4d6-7656-48be-b5de-3eb132b629d9/community_helpers_helper_town_general_aw_0_card_1_66ef5ab3_5db30400937f.png",
                        "type": "FLASHCARD"
                    },
                    {
                        "label": "Flashcard 2",
                        "resourceUrl": "https://dev-cdn.creativegalileo.com/media/ai_flashcards/2026-11-23/image/92a28f82-5cb5-4b1f-834e-0f7248e54f4b/community_helpers_helper_town_general_aw_0_card_2_fb61a6f4_fbd455065b46.png",
                        "type": "FLASHCARD"
                    }
                ],
                "sectionPresentations": [],
                "sectionArtifacts": []
            },
            {
                "localSectionKey": "conceptual-understanding",
                "title": "Conceptual Understanding",
                "description": "[\"Activity: Match the Helper to the Tool (~7 min) — build understanding that different community helpers use different tools for their work. Thread: the same Helper Town visitors receive the tools they need.\",\"Setup: Place 4 community-helper picture cards (doctor, firefighter, police officer, gardener) in a row and keep 4 tool picture cards (stethoscope, hose, whistle, watering can) in the 1 small cloth bag labelled Helper Town; learners sit in a semicircle.\",\"Step 1 — Educator: Takes the stethoscope picture card from the 1 small cloth bag labelled Helper Town, places it under the doctor picture card, and says, \\\"The doctor uses a stethoscope to listen to a heartbeat.\\\" The matching pair explains how a tool helps a worker.\",\"Step 2 — Learners: Take turns choosing one tool picture card from the 4 tool picture cards and hold it beside the community-helper picture card they think matches.\",\"Step 3 — Educator: Guides a learner holding the hose picture card toward the firefighter picture card and says, \\\"A firefighter uses a hose to help put out fire.\\\" The educator models the connection without expecting a long verbal answer.\",\"Step 4 — Learners: Repeat one short sentence such as \\\"The gardener uses a watering can\\\" while placing the watering can picture card below the gardener picture card.\",\"Step 5 — Educator: Places the whistle picture card below the police officer picture card and says, \\\"A police officer may use a whistle to guide people safely.\\\" The educator accepts pointing, gestures, or words as meaningful responses.\",\"Questions to ask: \\\"Which tool helps the doctor?\\\" \\\"Who uses the watering can?\\\"\",\"Support/Inclusion: Offer two choices at a time, such as the doctor picture card and gardener picture card, and allow a learner to match by pointing; invite a ready learner to explain what the helper does with the matched tool.\",\"Wrap-up/Check: Learners correctly match at least three of the 4 tool picture cards with the 4 community-helper picture cards; the educator gathers the matched cards for the hands-on practice.\"]",
                "order": 4,
                "sectionContents": [],
                "sectionResources": [
                    {
                        "label": "Flashcard 1",
                        "resourceUrl": "https://dev-cdn.creativegalileo.com/media/ai_flashcards/2026-11-23/image/e504e83f-acfe-4ab5-b8cd-ab1c44777aee/community_helpers_helper_town_general_aw_0_card_1_f0f713c5_13dbcbfacc84.png",
                        "type": "FLASHCARD"
                    }
                ],
                "sectionPresentations": [],
                "sectionArtifacts": []
            },
            {
                "localSectionKey": "practice-application",
                "title": "Practice & Application",
                "description": "[\"Activity: Helpers at Work Role Play (~10 min) — let learners use helper roles and actions to show how community helpers serve people. Thread: learners become the Helper Town visitors and bring the helpers to life.\",\"Setup: Place 4 paper helper badges (doctor, firefighter, police officer, gardener), 4 community-helper picture cards (doctor, firefighter, police officer, gardener), and 4 tool picture cards (stethoscope, hose, whistle, watering can) on the floor; learners stand in a circle.\",\"Step 1 — Educator: Holds up the doctor paper helper badge and the stethoscope picture card and says, \\\"The doctor helps a person feel better. Pretend to listen gently with the stethoscope.\\\" The educator demonstrates safe, imaginary role play.\",\"Step 2 — Learners: Choose or receive one of the 4 paper helper badges, hold the matching community-helper picture card, and act out one safe helper action using the matching tool picture card.\",\"Step 3 — Educator: Holds up the firefighter paper helper badge and the hose picture card and says, \\\"Firefighters help keep people safe. Show spraying water with your hands, but do not run.\\\" The clear instruction supports safe movement.\",\"Step 4 — Learners: Move slowly around the circle as firefighters, police officers, gardeners, or doctors and say the helper name when the educator points to the matching community-helper picture card.\",\"Step 5 — Educator: Invites each learner to place the paper helper badge beside its matching community-helper picture card and says, \\\"Your helper has a special job in Helper Town.\\\" The matching action reinforces identity and role.\",\"Questions to ask: \\\"How can a gardener help a plant?\\\" \\\"Which helper keeps people safe?\\\"\",\"Support/Inclusion: Give a learner who needs support one paper helper badge and one matching tool picture card, and model the action beside the learner; invite a ready learner to show two safe actions for the same helper.\",\"Wrap-up/Check: Each learner names, points to, or acts out one community helper and one helpful action; learners return the 4 paper helper badges and 4 tool picture cards to the centre before sharing.\"]",
                "order": 5,
                "sectionContents": [],
                "sectionResources": [],
                "sectionPresentations": [],
                "sectionArtifacts": []
            },
            {
                "localSectionKey": "sharing-expansion",
                "title": "Sharing & Expansion",
                "description": "[\"Activity: Helper Town Thank-You Circle (~8 min) — extend learning by connecting helper roles with gratitude and everyday community life. Thread: the Helper Town visitors finish their visit by sharing how they help everyone.\",\"Setup: Place 1 sheet of chart paper with four helper spaces, 4 community-helper picture cards (doctor, firefighter, police officer, gardener), and 8 crayons (red, blue, green, yellow) in the centre; learners sit in a circle.\",\"Step 1 — Educator: Points to the four helper spaces on 1 sheet of chart paper and says, \\\"Helper Town thanks people who help us. Let us remember one helper and one helpful job.\\\" The chart paper gives learners a shared place to show their ideas.\",\"Step 2 — Learners: Choose one of the 4 community-helper picture cards, place it in a matching helper space on the chart paper, and say the helper name or show the helper action.\",\"Step 3 — Educator: Gives 8 crayons (red, blue, green, yellow) to pairs and says, \\\"Draw one small mark or picture near a helper to show thanks.\\\" The crayons allow non-verbal learners to participate in the shared message.\",\"Step 4 — Learners: Work in pairs to add simple marks or drawings with the 8 crayons and tell a partner, \\\"Thank you, doctor,\\\" \\\"Thank you, firefighter,\\\" \\\"Thank you, police officer,\\\" or \\\"Thank you, gardener.\\\"\",\"Step 5 — Educator: Looks at the 1 sheet of chart paper and says, \\\"Helpers make Helper Town safer, healthier, and greener. We can also help by being kind and careful.\\\" The educator links community service to an age-appropriate daily action.\",\"Questions to ask: \\\"Which helper would you thank today?\\\" \\\"How can you help someone in our classroom?\\\"\",\"Support/Inclusion: Let a learner point to a community-helper picture card, use a home-language thank-you, or make one crayon mark; invite a ready learner to say the helper's job and describe one kind action.\",\"Wrap-up/Check: Each learner shares one helper name, tool, job, or thank-you action; the educator praises the shared chart paper and closes by saying, \\\"Helper Town is happy because we know and respect community helpers.\\\"\"]",
                "order": 6,
                "sectionContents": [],
                "sectionResources": [
                    {
                        "label": "Flashcard 1",
                        "resourceUrl": "https://dev-cdn.creativegalileo.com/media/ai_flashcards/2026-11-23/image/792bdce3-dfde-4444-9508-e7ad90c9c45d/community_helpers_helper_town_general_aw_0_card_1_e5266b0a_4f64a9ede558.png",
                        "type": "FLASHCARD"
                    }
                ],
                "sectionPresentations": [],
                "sectionArtifacts": []
            }
        ],
        "schedules": [
            {
                "unit": 1,
                "day": 2,
                "week": 1,
                "index": null,
                "term": null
            }
        ],
        "branchId": "835c5175-fdc3-4610-ad88-6ddf9441f893",
        "lessonContents": [],
        "lessonArtifacts": [],
        "lessonPlanPresentations": [],
        "resources": [
            {
                "label": "community helpers for nursery learners",
                "resourceUrl": "https://www.youtube.com/results?search_query=community+helpers+for+nursery+learners",
                "type": "EXTERNAL_RESOURCES"
            },
            {
                "label": "community helper role play for preschool",
                "resourceUrl": "https://www.youtube.com/results?search_query=community+helper+role+play+for+preschool",
                "type": "EXTERNAL_RESOURCES"
            },
            {
                "label": "Flashcard 1",
                "resourceUrl": "https://dev-cdn.creativegalileo.com/media/ai_flashcards/2026-11-23/image/2d7ae4d2-99f1-4bc8-a352-dff9c53e3458/community_helpers_helper_town_general_aw_0_card_1_631cb20c_574ea5cfc3f6.png",
                "type": "FLASHCARD"
            },
            {
                "label": "Flashcard 2",
                "resourceUrl": "https://dev-cdn.creativegalileo.com/media/ai_flashcards/2026-11-23/image/3fdf68d7-093e-4ca6-a737-722ae57fd306/community_helpers_helper_town_general_aw_0_card_2_3326ee45_466b230c54a2.png",
                "type": "FLASHCARD"
            },
            {
                "label": "Flashcard 3",
                "resourceUrl": "https://dev-cdn.creativegalileo.com/media/ai_flashcards/2026-11-23/image/f5b9f4d6-7656-48be-b5de-3eb132b629d9/community_helpers_helper_town_general_aw_0_card_1_66ef5ab3_5db30400937f.png",
                "type": "FLASHCARD"
            },
            {
                "label": "Flashcard 4",
                "resourceUrl": "https://dev-cdn.creativegalileo.com/media/ai_flashcards/2026-11-23/image/92a28f82-5cb5-4b1f-834e-0f7248e54f4b/community_helpers_helper_town_general_aw_0_card_2_fb61a6f4_fbd455065b46.png",
                "type": "FLASHCARD"
            },
            {
                "label": "Flashcard 5",
                "resourceUrl": "https://dev-cdn.creativegalileo.com/media/ai_flashcards/2026-11-23/image/e504e83f-acfe-4ab5-b8cd-ab1c44777aee/community_helpers_helper_town_general_aw_0_card_1_f0f713c5_13dbcbfacc84.png",
                "type": "FLASHCARD"
            },
            {
                "label": "Flashcard 6",
                "resourceUrl": "https://dev-cdn.creativegalileo.com/media/ai_flashcards/2026-11-23/image/792bdce3-dfde-4444-9508-e7ad90c9c45d/community_helpers_helper_town_general_aw_0_card_1_e5266b0a_4f64a9ede558.png",
                "type": "FLASHCARD"
            }
        ],
        "description": "Lesson thread: Helper Town visitors — learners meet community helpers, match their tools, act out their helpful jobs, and share thanks."
    }
]

};
