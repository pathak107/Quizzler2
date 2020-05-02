use quizzler2;


create table question(
qid int auto_increment,
question varchar(500),
answer varchar(300),
primary key(qid)
);
create table user(
user_id int auto_increment,
userName varchar(50),
userPassword varchar(200),
userLevel int default 1,
userScore int default 0,
primary key(user_id),
foreign key (userLevel) references question(qid)
);
drop table question;
drop table user;

select question,userScore from user natural join question where userLevel=qid and user_id =1;
Select count(*) as numQues from question;

select * from question;
select* from user;

alter table user drop userScore;

select userName from user where user_id=3 AND userLevel <(select count(*) from question); 
select userName from user where user_id=3 AND 2 <(select count(*) from question);

UPDATE user
SET userScore = userScore+1
WHERE user_id=3;

select answer,userLevel from user natural join question where userLevel=qid and user_id =3

select true from user where user_id=3 and userLevel < (select count(*) from question);

select user_id from user where userName ="pathak" And userPassword = "safaf";
select * from user where userName ="pathak" And userPassword ="safaf";
Select userScore from user where user_id =5
insert into user (userName,userPassword) values ('Shubham','sagsdg');




INSERT INTO `quizzler2`.`question` (`qid`, `question`, `answer`) VALUES ('2', 'A woman shot her husband, and held him underwater for three minutes. Later that night, they had a lovely dinner together. How is this possible?', 'She shot him with a camera');
INSERT INTO `quizzler2`.`question` (`qid`, `question`, `answer`) VALUES ('3', 'A man was found dead with a cassette recorder in one hand and a gun in the other. When the police arrived, they immediately played the cassette. First they heard the dead man’s voice, “I have nothing to live for,” then the sound of a gunshot. Upon listening to the tape, the police knew that it was not a suicide, but a homicide. How did they know?', 'Dead men can\'t rewind cassettes');
INSERT INTO `quizzler2`.`question` (`question`, `answer`) VALUES ('A businesswoman was stabbed while on a trip to Canada. The suspects are Mason, Mary, Bryan, Lily, Alexandra, and Patrick. Written in blood on the woman’s calendar are the numbers 3, 4, 9, 10, and 11. Who is the killer?', 'The months spell out the name: Mason');
INSERT INTO `quizzler2`.`question` (`question`, `answer`) VALUES ('A detective, who was only days away from discovering the identity of a top brass mob boss, has suddenly gone missing. She left behind a single note: 5508 51 7718. Currently there are 3 suspects: Bill, Lucky, and Greg. Can you crack the detective’s code?', 'Upside down: \"Bill is boss.\"');
INSERT INTO `quizzler2`.`question` (`question`, `answer`) VALUES ('A railroad tycoon is found murdered on a Sunday morning. His wife calls the police, who question the wife and the servants. The police collect the following alibis: the wife was in bed, the butler was polishing the silverware, the gardener was trimming trees, the maid was getting the mail, and the cook was preparing breakfast. The police arrest the murderer on the spot. Who did it, and how did the police know?', 'The maid: there is no mail on Sundays');
INSERT INTO `quizzler2`.`question` (`question`, `answer`) VALUES ('A man murders his wife with a knife, leaving no trace and no witnesses. He returns home. An hour later the police call to tell him that his wife has been murdered and to come to the scene of the crime straight away. As soon as he arrives, he is arrested. How did the police know he did it?', 'Police didn\'t tell the man where the crime scene was');
INSERT INTO `quizzler2`.`question` (`question`, `answer`) VALUES ('On Thursday afternoon, a friendly woman brought a home baked pie to her wealthy neighbor’s house. She noticed that the front door was ajar, and through the crack she could see her neighbor’s body lying in a pool of dried blood. On the porch were two packages, unopened letters, Monday\'s newspaper, junk mail, and a flyer for a plumbing service. A police officer arrived on the scene and suspects murder. Who does she suspect and why?', 'The person delivering the newspaper knew not to deliver past Monday');
INSERT INTO `quizzler2`.`question` (`question`, `answer`) VALUES ('A dead body is discovered at the bottom of a five story building. A homicide detective is called in. He goes to the first floor, opens the window, and flips a coin out the window. He goes up to the second floor and does the same thing. He does this on every floor. On the fifth floor he knows it was a murder, not a suicide. How?', 'You can\'t close a window if you jump');
INSERT INTO `quizzler2`.`question` (`question`, `answer`) VALUES ('A girl was attending her grandmother’s funeral when she met an intriguing man. She spent most of the funeral comforting grieving relatives, and didn’t get a chance to even get the man’s name. Later, when she went to find him, he had already left. A week later, she murdered her older brother. Why?', 'She wanted to see the man again');
