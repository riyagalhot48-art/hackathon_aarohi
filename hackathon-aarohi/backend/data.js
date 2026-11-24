// Content served by the API. Move this into PostgreSQL later (see db/schema.sql).
const PLANS={
good:{msg:"Full plan: college, learning, career prep and breaks.",items:[
["5:30 PM","Coding practice, 60 min","career","Career"],["6:45 PM","Dinner and a short walk","rest","Rest"],["7:30 PM","Work on your project, 90 min","career","Career"],["9:00 PM","Review today’s class notes, 30 min","study","Study"],["10:00 PM","Wind down and sleep","rest","Rest"]]},
ok:{msg:"Balanced plan: the essentials, with a longer break.",items:[
["5:30 PM","Coding practice, 40 min","career","Career"],["6:30 PM","Dinner and a proper break","rest","Rest"],["7:30 PM","Project work, 45 min","career","Career"],["8:30 PM","Review class notes, 20 min","study","Study"],["10:00 PM","Wind down and sleep","rest","Rest"]]},
low:{msg:"Lighter plan: just the essentials. Rest counts as progress too.",items:[
["5:30 PM","One small task: 20 min of practice","career","Career"],["6:00 PM","Dinner and 10 minutes of stretching","rest","Rest"],["7:00 PM","Quick look at tomorrow’s classes","study","Study"],["9:00 PM","Do something you enjoy","rest","Rest"],["9:45 PM","Early night","rest","Rest"]]}};

const ROLES={
"Software developer":{skills:["Python or JavaScript basics","Data structures and algorithms","Git and GitHub","Databases and SQL"],projects:["Personal portfolio site","To-do app with login","Study planner with a database"],next:"Start with one language and build the portfolio site first.",ops:"Look for internships on company career pages, and for scholarships on official government and university portals."},
"Data analyst":{skills:["Excel and spreadsheets","SQL","Python with pandas","Charts and dashboards"],projects:["Analyse a public dataset","Build a sales dashboard","Write up findings in a short report"],next:"Pick a public dataset you care about and ask three questions of it.",ops:"Check official portals for internships and training, and verify every listing before you apply."},
"UI/UX designer":{skills:["Design basics: layout and colour","Figma","User research","Prototyping and testing"],projects:["Redesign an app you use daily","Design a mobile app flow","Case study with before and after"],next:"Redesign one screen of an app you use and write down why you changed it.",ops:"Look for design internships and competitions on official college and company pages."}};

const TOPICS={
"Managing stress":{t:"Managing stress during exams",p:["Break work into small blocks with short breaks between them.","Move a little each day, even a ten-minute walk.","Keep a regular sleep time where you can.","Talk to a friend or family member about how you feel."],w:"If stress feels constant or is getting in the way of daily life, talk to a counsellor or doctor."},
"Sleep":{t:"Getting better sleep",p:["Aim for a steady bedtime and wake time.","Keep screens away for the last half hour before bed.","Avoid caffeine late in the day.","Keep your room dark and cool."],w:"If you often can’t sleep or feel exhausted despite resting, see a doctor."},
"Cycle health":{t:"Understanding your menstrual cycle",p:["Cycles vary a lot between people, and that’s normal.","Tracking your dates helps you notice your own pattern.","Rest, warmth and light movement help some people with cramps.","Stay hydrated and eat regular meals."],w:"If your periods are very painful, very heavy or suddenly change, see a doctor."},
"Low mood":{t:"When your mood is low",p:["Low days happen. Be gentle with your to-do list.","Get daylight, water and a proper meal.","Reach out to someone you trust, even with one message.","Try one small thing you usually enjoy."],w:"If low mood lasts more than a couple of weeks or you feel hopeless, please talk to a qualified professional or someone you trust soon."}};

module.exports = { PLANS, ROLES, TOPICS };
