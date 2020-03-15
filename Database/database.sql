use quizzler2;


create table question(
qid int auto_increment,
question varchar(100),
answer varchar(50),
primary key(qid)
);
create table user(
user_id int auto_increment,
userName varchar(50),
userPassword varchar(50),
userLevel int default 1,
userScore int default 0,
primary key(user_id),
foreign key (userLevel) references question(qid)
);

drop table user;

select question,userScore from user natural join question where userLevel=qid and user_id =1;


select * from question;
select* from user;
select user_id from user where userName ="pathak" And userPassword = "safaf";
select * from user where userName ="pathak" And userPassword ="safaf";
Select userScore from user where user_id =5
insert into user (userName,userPassword) values ('Shubham','sagsdg');