insert into workouts (category_id, title, slug, description, instructions, video_url, requires_login) values
(
  (select id from categories where slug = 'chest'),
  'Chest Flyes',
  'chest-chest-flyes',
  'Chest flyes target the chest muscles and help improve chest muscle definition and strength.',
  array['Lie on a flat bench with a dumbbell in each hand, palms facing each other.','Extend your arms above your chest with a slight bend in your elbows.','Lower the dumbbells out to the sides in a wide arc until you feel a stretch in your chest.','Bring the dumbbells back together over your chest, squeezing your chest muscles.','Repeat for the desired number of repetitions.'],
  'chest fly.mp4',
  true
),
(
  (select id from categories where slug = 'chest'),
  'Push-Ups',
  'chest-push-ups',
  'Push-ups are a classic upper body exercise that targets the chest muscles, as well as the shoulders, triceps, and core.',
  array['Start in a high plank position with your hands slightly wider than shoulder-width apart.','Lower your body until your chest nearly touches the ground.','Push back up to the starting position, fully extending your arms.','Repeat for the desired number of repetitions.'],
  'push ups.mp4',
  true
),
(
  (select id from categories where slug = 'chest'),
  'Pec Dec Flyes',
  'chest-pec-dec-flyes',
  'Pec Dec Flyes target the chest muscles and help improve chest muscle definition and strength.',
  array['Adjust the seat height and arm position on the machine.','Grasp the handles with your hands shoulder-width apart.','Bring the handles together in front of your chest, squeezing your chest muscles.','Return to the starting position with control.','Repeat for the desired number of repetitions.'],
  'pec dec fly.mp4',
  true
),
(
  (select id from categories where slug = 'chest'),
  'Decline Dumbbell Press',
  'chest-decline-dumbbell-press',
  'The decline dumbbell press targets the lower portion of the chest muscles and also engages the front deltoids and triceps.',
  array['Set an adjustable bench to a 30-45 degree decline.','Sit on the bench with a dumbbell in each hand resting on your thighs.','Lean back and bring the dumbbells to shoulder level, palms facing your feet.','Press the dumbbells up and together.','Lower the dumbbells back to the starting position with control.'],
  'Decline Dumbbell Press.mp4',
  true
);

insert into workouts (category_id, title, slug, description, instructions, video_url, requires_login) values
(
  (select id from categories where slug = 'back'),
  'Deadlifts',
  'back-deadlifts',
  'Deadlifts are a compound exercise that target the lower back, glutes, hamstrings, and forearms.',
  array['Stand with your feet shoulder-width apart and hold a barbell with your hands shoulder width apart.','Engage your core and keep your back straight as you lower the barbell towards the ground.','Push through your heels and extend your hips and knees to lift the barbell back up to the starting position.','Keep the barbell close to your body throughout the movement.','Repeat for the desired number of repetitions.'],
  'Deadlift.mp4',
  true
),
(
  (select id from categories where slug = 'back'),
  'Bent-Over Rows',
  'back-bent-over-rows',
  'Bent-over rows target the upper back, lats, and biceps.',
  array['Hold a dumbbell in each hand and bend over at the waist, keeping your back straight.','Engage your core and pull the dumbbells towards your hips, squeezing your shoulder blades together.','Lower the dumbbells back to the starting position.','Repeat for the desired number of repetitions.'],
  'bent over rows.mp4',
  true
),
(
  (select id from categories where slug = 'back'),
  'Lat Pulldowns',
  'back-lat-pulldowns',
  'Lat pulldowns target the lats, upper back, and biceps.',
  array['Adjust the lat pulldown machine to fit your body and sit down with your knees secured under the pads.','Grasp the bar with an overhand grip slightly wider than shoulder-width apart.','Pull the bar down to your chest, keeping your elbows close to your body.','Slowly return the bar to the starting position.','Repeat for the desired number of repetitions.'],
  'lat pulldowns.mp4',
  true
),
(
  (select id from categories where slug = 'back'),
  'Seated Cable Row',
  'back-seated-cable-row',
  'Seated cable rows target the upper back, lats, and biceps.',
  array['Adjust the seated cable row machine to fit your body and sit down with your back against the pad.','Grasp the handle with an overhand grip slightly wider than shoulder-width apart.','Pull the handle towards your chest, keeping your elbows close to your body.','Slowly return the handle to the starting position.','Repeat for the desired number of repetitions.'],
  'Seated Cable Row.mp4',
  true
),
(
  (select id from categories where slug = 'back'),
  'Pull Ups',
  'back-pull-ups',
  'Pull ups target the lats, upper back, and biceps.',
  array['Hang from a pull-up bar with your hands slightly wider than shoulder-width apart.','Pull yourself up until your chin is above the bar.','Lower yourself back down with control.','Repeat for the desired number of repetitions.'],
  'pull ups.mp4',
  true
),
(
  (select id from categories where slug = 'back'),
  'Barbell Shrugs',
  'back-barbell-shrugs',
  'Barbell shrugs target the trapezius muscles.',
  array['Stand with your feet shoulder-width apart and hold a barbell with an overhand grip.','Shrug your shoulders up towards your ears, squeezing your trapezius muscles at the top of the movement.','Slowly lower the bar back down to the starting position.','Repeat for the desired number of repetitions.'],
  'Shrugs.mp4',
  true
),
(
  (select id from categories where slug = 'shoulders'),
  'Shoulder Press',
  'shoulders-shoulder-press',
  'The shoulder press is a compound exercise that targets the deltoid muscles.',
  array['Stand with your feet shoulder-width apart.','Hold a barbell or dumbbells at shoulder height with your palms facing forward.','Press the weight overhead until your arms are fully extended.','Lower the weight back to the starting position.','Repeat for the desired number of repetitions.'],
  'shoulder press.mp4',
  true
),
(
  (select id from categories where slug = 'shoulders'),
  'Lateral Raises',
  'shoulders-lateral-raises',
  'Lateral raises target the lateral deltoid muscles and help build shoulder width.',
  array['Stand with your feet shoulder-width apart.','Hold a dumbbell in each hand with your palms facing your body.','With a slight bend in your elbows, raise the dumbbells out to the sides until they are parallel to the ground.','Lower the dumbbells back to the starting position.','Repeat for the desired number of repetitions.'],
  'Lateral Raises.mp4',
  true
),
(
  (select id from categories where slug = 'shoulders'),
  'Front Raises',
  'shoulders-front-raises',
  'Front raises target the front deltoid muscles and help build shoulder strength.',
  array['Stand with your feet shoulder-width apart.','Hold a dumbbell in each hand with your palms facing your body.','With a slight bend in your elbows, raise the dumbbells in front of you until they are parallel to the ground.','Lower the dumbbells back to the starting position.','Repeat for the desired number of repetitions.'],
  'Front Raise.mp4',
  true
),
(
  (select id from categories where slug = 'shoulders'),
  'Cable Lateral Raises',
  'shoulders-cable-lateral-raises',
  'Cable lateral raises target the lateral deltoid muscles and help build shoulder width.',
  array['Stand facing a cable machine with the cable at shoulder height.','Hold the handle with one hand and step away from the machine.','With a slight bend in your elbow, raise the handle out to the side until it is parallel to the ground.','Lower the handle back to the starting position.','Repeat for the desired number of repetitions.'],
  'Cable Lateral Raises.mp4',
  true
),
(
  (select id from categories where slug = 'shoulders'),
  'Face Pull',
  'shoulders-face-pull',
  'Face pulls target the rear deltoid muscles and help improve shoulder stability.',
  array['Stand facing a cable machine with the cable at shoulder height.','Hold the rope attachment with both hands and step away from the machine.','With a slight bend in your elbows, pull the rope towards your face until it touches your forehead.','Return the rope to the starting position.','Repeat for the desired number of repetitions.'],
  'Cable Face Pulls.mp4',
  true
),
(
  (select id from categories where slug = 'shoulders'),
  'Upright Row',
  'shoulders-upright-row',
  'Upright rows target the traps and lateral deltoid muscles.',
  array['Stand facing a barbell or dumbbells with your feet shoulder-width apart.','Hold the barbell or dumbbells with an overhand grip slightly narrower than shoulder-width apart.','With a slight bend in your elbows, raise the weight towards your chin, keeping it close to your body.','Lower the weight back to the starting position.','Repeat for the desired number of repetitions.'],
  'upright row.mp4',
  true
),
(
  (select id from categories where slug = 'biceps'),
  'Biceps Curl',
  'biceps-biceps-curl',
  'The biceps curl is an isolation exercise that targets the biceps brachii muscle.',
  array['Stand with your feet shoulder-width apart.','Hold a dumbbell in each hand with your palms facing forward.','Curl the dumbbells towards your shoulders, keeping your elbows close to your sides.','Squeeze your biceps at the top of the movement, then lower the dumbbells back to the starting position.'],
  'bicep curl.mp4',
  true
),
(
  (select id from categories where slug = 'biceps'),
  'Hammer Curl',
  'biceps-hammer-curl',
  'The hammer curl is a variation of the biceps curl that targets the biceps brachii and brachialis muscles.',
  array['Stand with your feet shoulder-width apart.','Hold a dumbbell in each hand with your palms facing each other.','Curl the dumbbells towards your shoulders, keeping your elbows close to your sides.','Squeeze your biceps at the top of the movement, then lower the dumbbells back to the starting position.','Repeat for the desired number of repetitions.'],
  'hammer curl.mp4',
  true
),
(
  (select id from categories where slug = 'biceps'),
  'Spider Curl',
  'biceps-spider-curl',
  'The spider curl is a variation of the biceps curl that targets the biceps brachii muscle.',
  array['Set an adjustable bench to a 45-degree incline.','Stand behind the bench and lean forward, resting your chest against the bench.','Hold a dumbbell in each hand with your palms facing forward.','Curl the dumbbells towards your shoulders, keeping your elbows close to your sides.','Lower the dumbbells back to the starting position.','Repeat for the desired number of repetitions.'],
  'spider curl.mp4',
  true
),
(
  (select id from categories where slug = 'triceps'),
  'Triceps Pushdown',
  'triceps-triceps-pushdown',
  'The triceps pushdown is an isolation exercise that targets the triceps muscle.',
  array['Hold a barbell or rope with your hands shoulder-width apart.','Stand with your feet shoulder-width apart and engage your core.','Extend your arms and push the barbell down until your elbows are fully extended.','Slowly return to the starting position by bending your elbows.','Repeat for the desired number of repetitions.'],
  'tricep push down.mp4',
  true
),
(
  (select id from categories where slug = 'triceps'),
  'Skull Crushers',
  'triceps-skull-crushers',
  'Skull crushers are a triceps exercise that targets the long head of the triceps muscle.',
  array['Lie on a flat bench and hold a barbell or dumbbells over your chest with your arms extended.','Lower the weight towards your forehead by bending your elbows.','Extend your arms to lift the weight back to the starting position.','Repeat for the desired number of repetitions.','Caution: Use a spotter if lifting heavy weights to avoid injury.'],
  'skull crushers.mp4',
  true
),
(
  (select id from categories where slug = 'triceps'),
  'Diamond Push-Ups',
  'triceps-diamond-push-ups',
  'Diamond push-ups are a bodyweight exercise that targets the triceps and chest muscles.',
  array['Start in a push-up position with your hands close together to form a diamond shape.','Lower your body towards the ground by bending your elbows.','Push back up to the starting position by extending your arms.','Repeat for the desired number of repetitions.'],
  'diamond pushups.mp4',
  true
),
(
  (select id from categories where slug = 'triceps'),
  'Tricep Dips',
  'triceps-tricep-dips',
  'Tricep dips are a bodyweight exercise that targets the triceps muscle.',
  array['Sit on the edge of a bench or chair with your hands grasping the edge.','Walk your feet forward and lift your body off the bench.','Lower your body by bending your elbows until your arms are bent at a 90-degree angle.','Push back up to the starting position by extending your arms.','Repeat for the desired number of repetitions.'],
  'tricep dip.mp4',
  true
),
(
  (select id from categories where slug = 'triceps'),
  'Overhead Dumbbell Extension',
  'triceps-overhead-dumbbell-extension',
  'The overhead dumbbell extension is a triceps exercise that targets the long head of the triceps muscle.',
  array['Stand or sit with a dumbbell in one hand and raise it overhead.','Lower the dumbbell behind your head by bending your elbow.','Push the dumbbell back up to the starting position by extending your arm.','Repeat for the desired number of repetitions.'],
  'overhead dumbell extension.mp4',
  true
),
(
  (select id from categories where slug = 'triceps'),
  'Tricep Kickbacks',
  'triceps-tricep-kickbacks',
  'Tricep kickbacks are an isolation exercise that targets the triceps muscle.',
  array['Hold a dumbbell in each hand and bend over at the waist.','Extend your arms back by straightening your elbows.','Return to the starting position by bending your elbows.','Repeat for the desired number of repetitions.'],
  'tricep kickback.mp4',
  true
),
(
  (select id from categories where slug = 'legs'),
  'Weighted Squats',
  'legs-weighted-squats',
  'The weighted squat is a compound exercise that targets the quadriceps, hamstrings, glutes, and core while improving overall strength and stability.',
  array['Stand with your feet shoulder-width apart and toes slightly pointed outward.','Hold a barbell on your upper back or dumbbells at your sides or shoulders.','Engage your core, keep your chest up, and maintain a straight back.','Lower your body by bending your knees and pushing your hips back, keeping your weight on your heels.','Descend until your thighs are at least parallel to the ground.','Push through your heels to stand back up, fully extending your hips and knees.','Repeat for the desired number of repetitions.'],
  'weighted squats.mp4',
  true
),
(
  (select id from categories where slug = 'legs'),
  'Leg Press',
  'legs-leg-press',
  'The leg press targets the quadriceps, hamstrings, and glutes while providing lower back support.',
  array['Sit on the leg press machine with your back flat against the backrest.','Place your feet shoulder-width apart on the footplate.','Push the footplate away from you by extending your knees and hips.','Lower the footplate back to the starting position.','Repeat for the desired number of repetitions.'],
  'leg press.mp4',
  true
),
(
  (select id from categories where slug = 'legs'),
  'Leg Curls',
  'legs-leg-curls',
  'Leg curls target the hamstrings and help improve leg strength and stability.',
  array['Adjust the leg curl machine to fit your height and lie face down on the bench.','Place your legs under the padded lever and grip the handles for stability.','Curl your legs up towards your glutes by bending your knees.','Lower your legs back to the starting position.','Repeat for the desired number of repetitions.'],
  'leg curls.mp4',
  true
),
(
  (select id from categories where slug = 'legs'),
  'Lunges',
  'legs-lunges',
  'Lunges target the quadriceps, hamstrings, glutes, and calves while improving balance and coordination.',
  array['Stand with your feet hip-width apart and take a step forward with your right foot.','Bend both knees to lower your body towards the ground.','Push back up to the starting position.','Repeat on the other leg.','Continue alternating legs for the desired number of repetitions.'],
  'lunges.mp4',
  true
),
(
  (select id from categories where slug = 'legs'),
  'Calf Raises',
  'legs-calf-raises',
  'Calf raises target the calf muscles and help improve lower leg strength and stability.',
  array['Stand with your feet hip-width apart and lift your heels off the ground.','Hold the raised position for a moment, then lower your heels back down.','Repeat for the desired number of repetitions.','For added resistance, perform calf raises on a step or with weights.','To target different areas of the calves, perform calf raises with toes pointed in or out.'],
  'calf raises.mp4',
  true
),
(
  (select id from categories where slug = 'legs'),
  'Bulgarian Squats',
  'legs-bulgarian-squats',
  'The Bulgarian split squat is a unilateral lower-body exercise that targets the quadriceps, hamstrings, glutes, and core while improving balance and stability.',
  array['Stand a few feet in front of a bench and place one foot behind you on the bench.','Hold dumbbells at your sides or a barbell on your upper back for resistance.','Lower your back knee toward the ground while keeping your front knee aligned with your toes.','Descend until your front thigh is parallel to the ground, then push through your front heel to stand back up.','Repeat for the desired number of repetitions, then switch legs.'],
  'bulgarian squat.mp4',
  true
),
(
  (select id from categories where slug = 'abs'),
  'Plank',
  'abs-plank',
  'The plank is a core exercise that targets the rectus abdominis, transverse abdominis, and obliques.',
  array['Start in a push-up position with your hands directly under your shoulders.','Engage your core and keep your body in a straight line from head to heels.','Hold the position for the desired amount of time.','Repeat for multiple sets.'],
  'plank.mp4',
  true
),
(
  (select id from categories where slug = 'abs'),
  'Hanging Leg Raises',
  'abs-hanging-leg-raises',
  'Hanging leg raises target the lower abdominal muscles, hip flexors, and core, helping to build strength and stability.',
  array['Hang from a pull-up bar with your hands shoulder-width apart and arms fully extended.','Keep your legs straight and engage your core.','Raise your legs until they are parallel to the ground or higher.','Lower your legs back down to the starting position in a controlled manner.','Reps: 10-15 per set | Sets: 3-4'],
  'hanging leg raises.mp4',
  true
),
(
  (select id from categories where slug = 'abs'),
  'Crunches',
  'abs-crunches',
  'Crunches are an abdominal exercise that target the rectus abdominis.',
  array['Lie on your back with your knees bent and your feet flat on the floor.','Place your hands behind your head or across your chest.','Engage your core and lift your head and shoulders off the ground.','Lower your head and shoulders back to the starting position.'],
  'crunches.mp4',
  true
),
(
  (select id from categories where slug = 'forearms'),
  'Wrist Curls',
  'forearms-wrist-curls',
  'Wrist curls targets the Flexor muscles (underside of forearm).',
  array['Hold a dumbbell in each hand with your palms facing forward.','Sit on a bench with your forearms resting on your thighs, palms facing up.','Curl the dumbbells upward by flexing your wrists.','Lower them slowly to the starting position.','Reps: 10-15 per set | Sets: 3-4'],
  'wrist curls.mp4',
  true
),
(
  (select id from categories where slug = 'forearms'),
  'Wrist Extensions',
  'forearms-wrist-extensions',
  'Wrist extensions targets the Extensor muscles (top of forearm).',
  array['Hold a dumbbell in each hand with your palms facing downward.','Curl your wrists upward, then slowly lower them back down.','Reps: 10-15 per set | Sets: 3-4'],
  'wrist extension.mp4',
  true
),
(
  (select id from categories where slug = 'forearms'),
  'Reverse Dumbbell Curls',
  'forearms-reverse-dumbbell-curls',
  'Reverse dumbbell curls target the extensor muscles on the top of the forearm, helping to improve grip strength and forearm development.',
  array['Hold a pair of dumbbells with your palms facing toward your body.','Curl the dumbbells up toward your shoulders, keeping your upper arms still.','Lower the dumbbells back down to the starting position.','Reps: 10-15 per set | Sets: 3-4'],
  'reverse dumbell curls.mp4',
  true
),
(
  (select id from categories where slug = 'cardio'),
  'High-Intensity Interval Training',
  'cardio-high-intensity-interval-training',
  'HIIT involves short bursts of intense exercise followed by periods of rest or lower-intensity exercise.',
  array['Warm up for 5 minutes.','Perform 30 seconds of high-intensity exercise (e.g., burpees).','Rest for 30 seconds.','Repeat steps 2-3 for 15-20 minutes.','Cool down for 5 minutes.'],
  'Burpees.mp4',
  true
),
(
  (select id from categories where slug = 'cardio'),
  'Jumping Rope',
  'cardio-jumping-rope',
  'Jumping rope is a great cardiovascular exercise that also improves coordination and agility.',
  array['Warm up for 5 minutes.','Jump continuously for 1-2 minutes.','Rest for 30 seconds.','Repeat steps 3-4 for 15-20 minutes.','Cool down for 5 minutes.'],
  'jumping rope.mp4',
  true
),
(
  (select id from categories where slug = 'cardio'),
  'Running',
  'cardio-running',
  'Running is a popular form of cardiovascular exercise that can be done outdoors or on a treadmill.',
  array['Warm up for 5 minutes.','Run at a comfortable pace for 20-30 minutes.','Cool down for 5 minutes.'],
  'running.mp4',
  true
),
(
  (select id from categories where slug = 'cardio'),
  'Cycling',
  'cardio-cycling',
  'Cycling is a low-impact cardio exercise that can be done indoors on a stationary bike or outdoors.',
  array['Warm up for 5 minutes.','Cycle at a moderate pace for 30-45 minutes.','Cool down for 5 minutes.'],
  'cycling.mp4',
  true
),
(
  (select id from categories where slug = 'cardio'),
  'Cross Trainer',
  'cardio-cross-trainer',
  'The cross trainer (elliptical) is a low-impact cardio machine that targets the legs, glutes, and core while improving cardiovascular endurance.',
  array['Step onto the pedals and grip the handles firmly.','Start moving your legs in a smooth, elliptical motion while engaging your core.','Push and pull the handles to engage your upper body or keep your hands stationary for a lower-body focus.','Maintain a steady pace and control your breathing throughout the workout.','Duration: 20-40 minutes | Intensity: Moderate to High'],
  'cross tainer.mp4',
  true
),
(
  (select id from categories where slug = 'cardio'),
  'Battle Rope',
  'cardio-battle-rope',
  'Battle Rope is a high-intensity cardio exercise that also engages the upper body and core muscles.',
  array['Warm up for 5 minutes.','Perform 3 sets of 30 seconds of Battle Rope exercise, with 30 seconds of rest in between sets.','Cool down for 5 minutes.'],
  'battle rope.mp4',
  true
),
(
  (select id from categories where slug = 'boxing'),
  'Jab Technique',
  'boxing-jab-technique',
  'The jab is a quick, straight punch thrown with the lead hand from the guard position.',
  array['Start in your boxing stance with your guard up.','Extend your lead arm straight out, rotating your fist as you punch.','Snap your punch back quickly to your guard position.','Keep your rear hand up to protect your face.','Practice the motion slowly at first, then increase speed as you improve.'],
  'jab.mp4',
  true
),
(
  (select id from categories where slug = 'boxing'),
  'Hook Technique',
  'boxing-hook-technique',
  'The hook is a powerful punch thrown with a bent arm in a semi-circular motion.',
  array['Start in your boxing stance with your guard up.','Rotate your lead foot and pivot on your rear foot as you throw the hook.'],
  'hook.mp4',
  true
),
(
  (select id from categories where slug = 'boxing'),
  'Uppercut Technique',
  'boxing-uppercut-technique',
  'The uppercut is a powerful punch thrown with a bent arm in a vertical motion.',
  array['Start in your boxing stance with your guard up.','Bend your knees slightly and rotate your body as you throw the uppercut.','Keep your elbow close to your body and aim for the opponent''s chin.'],
  'Uppercut.mp4',
  true
),
(
  (select id from categories where slug = 'boxing'),
  'Defense Techniques',
  'boxing-defense-techniques',
  'Defense techniques are essential for protecting yourself from your opponent''s punches.',
  array['Start in your boxing stance with your guard up.','Use head movement to slip, bob, and weave to avoid punches.','Block punches with your arms and gloves.','Practice footwork to maintain distance and angles.'],
  'defense.mp4',
  true
),
(
  (select id from categories where slug = 'boxing'),
  'Sparring Techniques',
  'boxing-sparring-techniques',
  'Sparring is a controlled practice fight that allows you to apply your boxing skills in a realistic setting.',
  array['Start with a partner and agree on a set of rules and goals.','Practice different combinations and techniques in a controlled manner.','Focus on defense and counter-punching as well as offense.','Communicate with your partner and provide feedback to help each other improve.'],
  'sparring.mp4',
  true
),
(
  (select id from categories where slug = 'boxing'),
  'Pivot Techniques',
  'boxing-pivot-techniques',
  'The pivot in boxing is a footwork technique used for defense, angle creation, and counterattacks while maintaining balance and mobility.',
  array['Stand in your boxing stance with your lead foot slightly pointed forward.','Keep your rear foot light and use the ball of your lead foot as a pivot point.','Rotate your body and rear foot in the desired direction while keeping your balance.','Maintain a strong stance to quickly counter or evade attacks.','Reps: 10-15 pivots per set | Sets: 3-4'],
  'pivot.mp4',
  true
),
(
  (select id from categories where slug = 'yoga'),
  'Sun Salutation (Surya Namaskar)',
  'yoga-sun-salutation-surya-namaskar',
  'Sun Salutation is a sequence of 12 powerful yoga poses that provide a full body workout.',
  array['Start in Mountain Pose (Tadasana).','Raise your arms upward (Urdhva Hastasana).','Bend forward into Standing Forward Bend (Uttanasana).','Step or jump back to Plank Pose.','Lower into Four-Limbed Staff Pose (Chaturanga Dandasana).','Lift your chest into Upward-Facing Dog (Urdhva Mukha Svanasana).','Push back into Downward-Facing Dog (Adho Mukha Svanasana).','Step or jump forward into Standing Forward Bend.','Rise up with arms overhead.','Return to Mountain Pose.','Repeat the sequence for desired repetitions.'],
  'suryanamaskar.mp4',
  true
),
(
  (select id from categories where slug = 'yoga'),
  'Warrior II (Virabhadrasana II)',
  'yoga-warrior-ii-virabhadrasana-ii',
  'Warrior II is a standing yoga pose that strengthens the legs, opens the hips, and improves balance.',
  array['Start in Mountain Pose.','Step your right foot forward into a wide stance.','Turn your left foot slightly inward and your right foot out 90 degrees.','Bend your right knee over your right ankle, keeping your thigh parallel to the ground.','Extend your arms out to the sides, parallel to the ground.','Gaze over your right hand.','Hold for 3-5 breaths.','Repeat on the other side.'],
  'warrior2.mp4',
  true
),
(
  (select id from categories where slug = 'yoga'),
  'Child''s Pose (Balasana)',
  'yoga-childs-pose-balasana',
  'Child''s Pose is a resting yoga pose that stretches the hips, thighs, and ankles while calming the mind.',
  array['Kneel on the ground with your knees wide apart.','Sit back onto your heels.','Extend your arms forward and lower your chest toward the ground.','Stretch your arms out in front of you and lower your forehead to the ground.','Hold for 5-10 breaths.'],
  'balasana.mp4',
  true
),
(
  (select id from categories where slug = 'yoga'),
  'Tree Pose (Vrksasana)',
  'yoga-tree-pose-vrksasana',
  'Tree Pose is a balancing yoga pose that strengthens the legs and improves focus and concentration.',
  array['Start in Mountain Pose.','Shift your weight onto your left foot.','Place the sole of your right foot on your inner left thigh or calf.','Bring your hands to prayer position at your heart.','Focus on a point in front of you to help with balance.','Hold for 3-5 breaths.','Repeat on the other side.'],
  'treepose.mp4',
  true
),
(
  (select id from categories where slug = 'yoga'),
  'Cobra Pose (Bhujangasana)',
  'yoga-cobra-pose-bhujangasana',
  'Cobra Pose is a backbend that strengthens the spine, opens the chest, and improves posture.',
  array['Start by lying on your stomach with your hands under your shoulders.','Press into your hands and lift your chest off the ground, keeping your elbows close to your body.','Engage your back muscles and lift your gaze upward.','Hold for 3-5 breaths.','Lower back down to the ground.'],
  'cobrapose.mp4',
  true
),
(
  (select id from categories where slug = 'yoga'),
  'Corpse Pose (Savasana)',
  'yoga-corpse-pose-savasana',
  'Corpse Pose is a resting pose that calms the mind and body.',
  array['Find a quiet and comfortable place to lie down.','Extend your legs and arms comfortably to the sides.','Close your eyes and relax your entire body.','Breathe deeply and let go of any tension or stress.','Hold for 5-10 minutes.'],
  'corpsepose.mp4',
  true
);