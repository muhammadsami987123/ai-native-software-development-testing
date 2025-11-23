Claude Code: A Highly Agentic Coding Assistant

Lesson 1: Introduction
"""
0:02
Welcome to Claude Code, the Highly Agentic Coding Assistant.
0:05
This short course is built in partnership with Anthropic
0:08
and Anthropic's Elie Schoppik is back to share with us
0:11
best practices for how to use Claude Code.
0:13
I'm really excited about this short course.
0:15
Claude Code's my personal favorite coding assistant right now,
0:18
and it has boosted my and many other developers' productivity
0:22
by a large margin. And it is a
0:24
tool with a lot of depth to it.
0:27
And so I want to get together with Anthropic,
0:29
to teach, hopefully the definitive course on
0:32
all of the most important ideas behind
0:35
how to use it in a systematic way.
0:37
Thanks, Andrew. I'm excited to be back
0:39
here and start like you mentioned from explaining
0:41
what the tool is, how it works,
0:43
all the way towards using it in parallel
0:45
with many different tools including Git worktrees and MCP servers.
0:50
What we've seen over the last couple
0:52
years is AI assisted coding has evolved rapidly.
0:54
It started from maybe people asking LLMs occasional coding questions.
0:58
suggestions to then GitHub autocomplete to then,
1:01
your various tools that became
1:03
more and more autonomous.
1:05
And Claude Code, when it was released,
1:08
was definitely a step up in terms of the degree of agency
1:10
or the amount of stuff that the coding assistant
1:13
could do by itself. And so
1:15
I think many people were surprised that
1:17
you could set a task that Claude would work on for
1:20
many minutes or sometimes even more than a few minutes.
1:23
And now there are developers that are orchestrating
1:25
not just a single Claude instance, but even several of them.
1:28
working in parallel on different parts
1:30
of a codebase. But coordinating all this
1:32
has to set the best practices that is not widely known
1:36
and if you have not worked
1:37
with people close to the best practices,
1:39
I think there could be a big uplift
1:41
still for mastering these best practices
1:45
and knowing how they drive that amazing productivity
1:47
that I'm seeing many developers have using Claude Code.
1:50
So as we start to talk about those best practices,
1:53
a key tip for working with Claude Code is providing clear context
1:57
to help Claude code achieve the task you want efficiently.
2:00
This means pointing Claude code to the relevant files,
2:03
clearly describing the features and functionality that you want
2:06
and making sure that you're properly extending
2:09
the capabilities of Claude code
2:11
with MCP servers and other tools in that ecosystem.
2:14
In this course, you'll apply those best practices to three different examples.
2:18
We'll start with a RAG chatbot
2:19
and you'll implement the features from
2:21
the front end to the back end,
2:22
including refactoring code, writing tests,
2:26
and then using the GitHub integration to
2:28
work with pull requests and fixing issues.
2:30
You'll make use of many Claude Code features
2:32
like planning, thinking modes, creating parallel sessions,
2:35
and managing Claude's memory.
2:37
For the second example, we'll shift gears and work with Jupyter notebooks
2:40
to explore e-commerce data.
2:42
We'll refactor notebooks using Claude Code, remove redundant code,
2:46
and create powerful dashboards with web applications.
2:49
Finally, we'll move to create a visual mockup
2:51
based in Figma and use Claude Code,
2:54
the Figma MCP server and a different
2:56
MCP server to import the design,
2:59
iterate, test, and build agentically a powerful front-end application.
3:03
If you're not currently a Claude Code user,
3:05
I think learning this set of
3:08
ideas will give you a meaningful acceleration
3:10
in the way that which you can engineer systems.
3:13
And even if you are a current Claude Code user,
3:15
I think having Ellie share these best practices
3:18
with you in a comprehensive and systematic way,
3:21
will, I hope, leave you with quite a few new things
3:24
you try that will be useful. your work.
3:27
I'd like to thank from DeepLearning.AI, Hawraa Salami,
3:29
who had contributed to this course.
3:32
In the next video, Elie will share
3:35
Claude Code's underlying architecture,
3:37
and you might be surprised by how simple the architecture is.
3:41
Claude Code relies on just a small number of tools to search
3:44
for patterns within your code files,
3:46
to list directories, look at files, do regex.
3:50
It does not rely on semantically embedding
3:52
your code in the code base or transforming it into
3:55
searchable structure. And one of the things that
3:58
I think has made Claude Code effective
3:59
is how it agentically can read through your code
4:03
to take notes in a file called code.md to figure out autonomously
4:08
what is going on your codebase to then
4:10
drive decision-making on how to advance your code.
4:13
That's right. And because of that, and not
4:15
having a need to index the codebase,
4:16
you can ensure the codebase stays local.
4:19
We'll talk about some of the security ramifications with that.
4:22
So let's get started. And I'll see you in the next video.
"""

Lesson 2: What is Claude Code?

"""
0:02
In this first lesson, we'll go
0:04
through the agentic workflow of Claude Code,
0:06
the tools it uses to navigate your codebase,
0:09
and the memory it keeps across sessions. Let's dive in.
0:12
So let's talk a little bit about what Claude Code actually is.
0:17
When we talk about agentic systems,
0:20
we think a lot about a model, a set of tools,
0:23
and some environment to run those tools.
0:26
Models are great at handling input and returning output.
0:30
But in many situations, those models don't know about your codebase,
0:35
how to find files, and how to handle multiple tasks.
0:39
So instead of just talking directly to a model,
0:41
we're going to provide a very lightweight harness for that model.
0:45
And through the command line, we're going to
0:48
use that harness to leverage the model's intelligence
0:51
to perform complex coding tasks.
0:53
So instead of giving a task directly to the model
0:57
and trying to find all kinds of information in a codebase.
1:00
We're going to provide a set of tools.
1:02
We're going to provide an environment
1:05
and a couple other pieces of functionality
1:08
to enable the model
1:10
to come through codebases and solve much more complex problems.
1:13
What are those pieces of functionality that we're talking about here?
1:16
Enabling the model to have memory,
1:19
enabling our model here to remember preferences of the user
1:23
and the codebase we're going through or the task at hand.
1:27
also going to give the model an environment
1:30
where it can figure out what data it needs,
1:33
formulate a plan and then take action.
1:35
With just a small amount of code,
1:37
we can leverage the model's intelligence to achieve quite remarkable results.
1:42
With Claude Code, your options
1:44
are Opus or Sonnet, depending on the complexity,
1:47
the kind of task you're handling, and your subscription.
1:50
When we talk about what Claude Code can do,
1:53
it's very tempting to just think this is the tool for
1:56
for writing lots of code. But as we progress in this course,
1:59
we're actually going to start with one of the most powerful features
2:03
of Claude Code, which is its ability
2:06
to discover, explain, and design.
2:09
Before you start writing code with Claude Code,
2:12
use it as a way to get
2:14
up to speed on a code base.
2:15
We'll talk quite a bit about writing code with Claude Code,
2:19
but we'll also talk about ways in which you can use it
2:22
outside of the terminal in environments like GitHub. We'll talk a bit
2:25
bit about refactoring, debugging errors
2:28
and where this tool really shines.
2:31
Not only is this useful for coding,
2:33
but also across data analysis and any environment
2:37
where the model's intelligence can create compelling
2:41
visualizations, assets or deliverables for you.
2:44
We mentioned that we give the model a harness.
2:47
We give the model an environment
2:49
to gather context and take an action.
2:52
We talked a bit about the
2:53
memory that we provide to the model.
2:54
And in a little bit, we'll talk
2:56
about what that underlying memory looks like.
2:58
Now, let's talk about the tools
3:01
or additional functionality that we let the model know about.
3:04
To give an illustration of tool use,
3:06
you can imagine that the user asks
3:08
what code is written in a particular file.
3:11
The model does not know how to navigate or
3:14
find files, and that's where tool use comes into play.
3:17
Out of the box, Claude Code
3:19
provides a relatively small list of
3:21
tools. One of those being the ability
3:23
to read a file. Now that the model knows what to do,
3:27
it can go ahead and read that file,
3:29
get the contents of that file,
3:31
and return the data to a user.
3:33
This ability of tool use allows the model to go
3:36
from a simple assistant to an extremely sophisticated agentic tool.
3:40
We mentioned some of the tools
3:42
that Claude Code comes built in with.
3:44
Here is a list of the tools that we have.
3:46
Some of those for editing across different kinds of files.
3:49
Some of those for reading across different files.
3:52
and some for doing additional actions
3:55
like finding patterns,
3:57
searching things across the web,
3:59
and even creating or running sub-agents
4:02
to handle very difficult and challenging tasks.
4:05
Finally, since we're in the command line,
4:07
we're going to need a tool to execute bash or shell commands.
4:12
Tool use is what allows Claude Code
4:15
to gather the context and information that it needs.
4:18
This allows Claude Code to tackle harder problems.
4:21
It also allows Claude Code
4:23
to not have to index your entire code base
4:25
and lead into potential security concerns.
4:28
Finally, Claude Code is quite extensible.
4:30
While you just saw the list of tools
4:32
that Claude Code comes built in with,
4:34
you can also add additional tools
4:36
by connecting to MCP servers.
4:39
MCP, or the model context protocol,
4:42
is an open-source model agnostic protocol
4:44
that allows for data and AI systems to communicate easily.
4:48
These MCP servers can
4:51
add functionality to Claude Code
4:53
for a variety of different tasks
4:55
and we'll explore a few of them over this course.
4:58
I want to take a little more time to
5:00
talk about what we mean by not indexing a codebase.
5:03
Instead of creating a structured representation of the codebase
5:08
and constantly analyzing that,
5:10
Claude Code instead uses a feature called agentic search.
5:13
Instead of requiring that that codebase is sent to a server
5:17
and potentially leaving the ecosystem that you're in,
5:20
Claude Code instead uses
5:22
one or many different agents and sets of tools
5:26
to find what it's looking for in your codebase.
5:29
This allows your code to not
5:31
have to be completely added to context
5:34
or to have to leave the ecosystem that it's in,
5:37
which can create certain security considerations.
5:40
When we talk about the memory of Claude or its ability
5:43
to remember what has happened in previous conversations
5:46
or across all kinds of
5:49
actions. This is done using a markdown file
5:52
called claude.md
5:54
In your claude.md file, you can define common configurations
5:58
or style guidelines.
5:59
These files get automatically loaded
6:02
into context when launched.
6:04
The conversation that you have with claude code
6:07
is stored locally on your machine.
6:09
You can clear that over the course of a conversation,
6:13
so you can start with a new context window.
6:16
But if for some reason, you need to continue
6:18
that previous one or resume the
6:20
earlier conversation, you can do so easily.
6:24
I'm going to head over to the
6:25
terminal that I have inside of VS Code.
6:28
And we can see I have a
6:29
folder here called demo with nothing in it.
6:31
So let's start by opening up Claude Code using the claude command.
6:35
Depending on where this file is, and especially the first time,
6:39
it may ask if I trust the
6:41
files in this folder, which I do.
6:43
We've gotten a couple nice tips here for getting
6:45
started, but I'm just going to start with a very simple prompt.
6:48
Make a cool visualization for me.
6:51
I'm just getting started. What we're
6:52
going to see here is Claude Code
6:54
start to make a to-do list of actions to take.
6:57
You can imagine this task might be to search across a codebase,
7:00
to edit files, to write tests, to deliver insights,
7:04
or in our case to create a visualization.
7:07
Depending on how Claude is feeling,
7:09
this might be particles or fireworks or something else,
7:11
but I just want to show you how quickly
7:13
out of the box you can
7:14
start to see changes with Claude Code.
7:16
Since we're doing this inside of Visual Studio Code
7:19
and Claude Code has an integration with that editor,
7:22
we're going to see visually the changes that are being made.
7:26
I'll accept those and in future editions,
7:28
I'll let Claude Code do that without requesting permission from me.
7:32
We can see here, we have a visualization that's built.
7:35
Let's go ahead and open it in the browser.
7:37
I'll ask Claude Code to do that for
7:39
me. It will confirm. This is the command.
7:40
Let's go see what it looks like.
7:42
And here we are with our visualization.
7:43
Can add some particles.
7:45
lookin' a bit better. You can toggle the animation,
7:48
see what's going on, and clear what we have here.
7:51
We can expand on this as much as we want.
7:53
We can change the functionality, we
7:55
can add whatever we want right here.
7:57
But I just want to show you
7:59
out of the box how seamless it is
8:01
to get up and running with this particular tool.
8:03
In the next lesson, we'll explore how
8:05
to use Claude Code across a larger codebase
8:07
and take a step back and see just how powerful it is
8:10
for explaining larger and more complex code bases.
"""

Lesson 2B: notes

"""
Course Notes
This note includes the instructions on how to install Claude Code, and the links to the coding examples and prompts used in the lessons.

Note:

To mark this reading item as complete, make sure to scroll down to the end and click on "Mark as Complete".
There's a second reading item at the end of this course. To get 100% course completion, make sure to also mark it as complete.
Claude Code Installation
To follow along with the lessons, here's how you can install Claude Code.

Install Node.js, then run:

npm install -g @anthropic-ai/claude-code

For more installation guides, you can find them here. If you're using Windows, make sure to check the Windows Setup here.

Once you have Claude Code installed, you can:

launch it from your terminal: navigate to your project folder & then type claude
launch it from the terminal integrated within VS Code by typing claude, the extension will auto-install.
If you run into issues, ensure that code command is available. If not installed, use Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows/Linux) and search for “Shell Command: Install ‘code’ command in PATH”
For more info, check Claude Code IDE Integrations.

Links to Course Codebase Examples
Here are the links to the coding examples covered in the lessons:

Codebase for the RAG chatbot (Lessons 2-6)

Here's the repo of the starting codebase used in lesson 2.
Lessons 3-6 add features to the starting codebase.
Here's the state of the codebase after lesson 5.
Feel free to fork the starting codebase and follow the lessons' activities.

E-commerce data analysis (Lesson 7)

Here are the lesson's files.
It includes the data, the starting and refactored notebooks, and the dashboard file.
Feel free to fork this repo, and try lesson 7 tasks using the starting notebook and the data folder.

Figma design mockup (Lesson 8)

Here's the link to the Figma mockup design (which you can open with Figma Desktop App).
In lesson 8, you will build a Next.js app based on this mockup.
Here's the link to the repo of the app we got during filming.
Prompts and Summaries of Lessons
You can find the prompts used in each lesson and a summary of Claude Code features in the optional reading item at the end of the course (Prompts & Summaries of Lessons). You can also find them in this repo.

Claude Code Cost
If you'd like to install Claude Code to try the lessons:

you can use the Pro or Max subscription. The pro subscription is enough for the lessons' activities.
Or, you can be billed based on API usage. For a given session, you can see the cost using the /cost command.
"""

Lesson 3: 
"""0:02
The first example we'll work on is an end-to-end RAG chatbot.
0:06
Let's use Claude Code to explore the code base.
0:09
Before we start using Claude Code
0:11
to write lots of code for us,
0:13
let's talk about how we can use this tool
0:16
to get up to speed on larger code bases.
0:19
Right here, I have an application where I can chat with Claude
0:23
about course materials from Deep Learning AI.
0:26
So let's try asking an outline of a course. For example, what
0:29
is the outline of the MCP Build Rich-Context AI Apps with Anthropic.
0:34
We'll see here that I'll get a
0:36
response with quite a bit of detail
0:38
around the lessons and descriptions for each of those lessons.
0:41
With that in mind, let's see how we can get
0:44
up to speed on the underlying code that powers this application.
0:48
Back in VS Code, I have
0:49
the terminal open here and I'm going
0:51
to hop into Claude Code just
0:53
by typing in claude and pressing enter.
0:55
In this application, I can start chatting with my codebase.
0:58
So I'm going to start with a high-level question just to
1:01
give me an overview of the codebase.
1:04
What we're going to see Claude Code do is agentically search
1:07
over the codebase, figure out some of the most important files
1:12
and give me a description of what's happening in this application.
1:15
Instead of searching through each individual file,
1:18
we're going to agentically search and find the most relevant ones.
1:21
So here we're going to get some information about
1:24
the architecture, the key components, some of the features,
1:28
and now if there are particular
1:30
things I want to dig into, I can easily do that.
1:33
I can also ask other higher level questions like how
1:36
are these documents processed?
1:38
In this application, we're using Retrieval Augmented Generation
1:42
to fetch information about these courses.
1:45
If I want to get more information about that process,
1:48
I can ask a question like this one.
1:50
We like to say that Claude Code is a fantastic
1:52
engineer alongside you,
1:54
but it's an even better explainer.
1:56
So as you're getting up to speed with new codebases,
1:59
new data sets. First, start using Claude Code
2:02
as a way to explain things to you,
2:04
so that when you ask it to write code,
2:06
you can have a better understanding of what's going on.
2:09
Here we can see the sources in the
2:12
code base that are actually splitting text into chunks,
2:15
that are adding lesson context and that are storing course metadata.
2:18
This ability to quickly get up to speed with a code base,
2:22
especially when you might not be
2:24
familiar with the underlying technology or language,
2:27
is exceptionally valuable. Instead of
2:29
navigating to each of these folders and figuring out what's going on,
2:34
we can ask more specific questions and even get diagrams
2:38
and visualizations made for us.
2:41
So the first thing I'll ask Claude
2:43
is to trace the process of handling a user's query
2:47
from front end to back end.
2:50
You can imagine you might have some limited knowledge
2:53
in one of the parts of the stack or
2:55
you're not familiar with how this is all happening.
2:58
So Claude Code is going to
2:59
give us quite some useful information here.
3:02
What's useful when you're seeing Claude Code work
3:04
is its ability to give you a bit of a to-do list,
3:07
so you can start to understand
3:09
what's happening. At any point in time,
3:12
you can press escape and guide Claude Code
3:15
to follow a different set of to-dos,
3:17
but in this case, I feel pretty good about what it's doing.
3:20
It's going to start tracing from the frontend, start following API endpoints,
3:24
analyze our Retrieval Augmented Generation system,
3:28
and then figure out how to actually generate the response.
3:31
It's reading the appropriate files that are handling these particular tasks
3:36
and finishing up its list to give us a powerful summary.
3:39
As we're in this environment,
3:41
we can stay within VS Code or open
3:43
up Claude Code in its own dedicated terminal instance.
3:47
That's completely up to you as you're working in this application.
3:50
Once it's done, we can see a
3:52
very detailed path for what's happening here.
3:55
Not only can I read each of these step-by-step,
3:58
I can even ask Claude to write this to a file,
4:00
but I'm seeing in quite a bit
4:02
of detail what's happening on the front end
4:04
with some JavaScript, what happens once that reaches my back end,
4:07
what the Retrieval Augmented Generation system is doing,
4:11
how I'm generating a response. Finally,
4:14
how I'm searching through my vector database,
4:16
how I'm filtering what's necessary, getting a response back,
4:20
and then finally, sending that to the user.
4:23
There's a lot that's going on in this application.
4:25
And I can use Claude to
4:26
dive deeper into any of those pieces.
4:29
But let's just say I learn best from visualizations.
4:32
So let's ask Claude to draw a diagram
4:34
that illustrates this flow.
4:37
We can ask Claude to draw diagrams
4:39
for web visualizations. We can ask for ASCII art.
4:43
But let's see what Claude comes up with
4:44
with its own intelligence and knowledge of how the application works.
4:49
So let's see what Claude code has come up with.
4:51
We've got a really nice diagram here
4:53
showing us the step-by-step process.
4:55
So it can't create these visual diagrams.
4:58
We could always ask it to use some something like D3.js
5:01
or recharts if we want something like a web application.
5:05
But we can see right here, we've got a really nice diagram.
5:08
From the front end, making a request to the back end,
5:11
calling the necessary functions,
5:13
generating the response necessary if there's any history involved,
5:18
talking directly to the large language model
5:21
with our system prompts and our tools and a query,
5:23
figuring out where to go next,
5:25
searching through our vector database using Chroma DB, getting back results
5:29
formatting that, sending it to the model to produce a final response.
5:34
There's quite a bit of detail that goes into this.
5:37
And if we want, we can even augment Claude with additional tools
5:41
for generating the visualizations that we want.
5:44
But out of the box, just getting this information quickly and efficiently
5:48
is going to help us get up to speed with this
5:50
codebase in a fraction of time that we used to spend.
5:54
So with that in mind, let's ask a
5:56
very simple question, how do I run
5:58
this application? You might be in a situation
6:00
where there's a new technology here, a new idea.
6:03
Very simply, it's nice to just
6:05
know how to get up and running.
6:07
I can see here, my API documentation,
6:09
my web interface, and if there are any environment variables I need,
6:13
I'm good to go. Now that you've gotten an idea
6:16
of how to just start talking to Claude Code.
6:18
Let's talk a little bit about some of the more powerful features
6:20
with Claude Code.
6:22
When you start working with an application in Claude Code,
6:25
one of the first things we
6:26
recommend you do is run a command
6:28
called /init.
6:29
You can see here in Claude Code, when I add this slash,
6:33
we have a list of many built-in commands that I can use.
6:36
/init allows me to initialize
6:38
a CLAUDE.md file with the codebase documentation.
6:42
The CLAUDE.md file is mission critical
6:45
for introducing memory for Claude Code,
6:48
so that it knows how best to work in your codebase.
6:52
The CLAUDE.md file is very useful
6:54
for specifying how you want things to be run.
6:57
This could be your tests, this could be your linting,
6:59
and any long-term memory that you want Claude to have
7:03
each time you're working with Claude Code for this particular project.
7:07
Instead of making this from scratch, /init
7:09
is going to analyze the codebase
7:11
to figure out at a high level what it should know about
7:14
each time you're working with this application.
7:18
There are three different CLAUDE.md files that you can make,
7:21
like the one generated with /init
7:23
all the way here on the left.
7:26
This CLAUDE.md file lives in your application. You can
7:29
have many of them in nested sub folders.
7:32
But this is shared with other
7:34
engineers and committed to your version control.
7:37
Another option is if you have personal instructions
7:39
and customizations, think specific for your editing environment
7:42
and terminal environment, you can put that in a CLAUDE.local.md file.
7:49
This is git ignored and not shared with other engineers.
7:53
Finally, in your home directory, in the
7:55
.claude folder, you can add a CLAUDE.md
7:57
and you can think of this like a
7:59
global claude.md for all projects on your machine.
8:03
This is helpful if you want Claude to follow instructions across
8:07
a wide range of projects that you build with Claude Code.
8:17
We can go ahead and allow Claude Code to find different
8:20
files so that it knows how best to create this CLAUDE.md file.
8:24
This CLAUDE.md file is meant to be
8:26
added to your current git project and
8:29
shared with other team members.
8:31
As more individuals work on the codebase,
8:34
they can add to this CLAUDE.md file,
8:36
and you can even nest CLAUDE.md files
8:39
in subdirectories if you need
8:41
more specific instructions for things like the backend
8:44
or frontend or our docs that we have here.
8:46
What's really nice about using a tool
8:49
like Claude Code with Visual Studio Code,
8:51
is that as I see changes to files,
8:54
I can see those visually in my editor.
8:56
And anytime that I am using a tool in Claude Code,
9:00
it's going to ask me for permissions.
9:02
This mission critical human in the loop is really important
9:05
when you get up and running,
9:07
and if you don't need Claude to ask you every single time,
9:10
can always use this second option. We'll
9:12
go ahead and auto accept those edits
9:14
and we'll see that a CLAUDE.md file has been created for us.
9:18
To give you a quick walk through,
9:21
we can see it's given us a
9:23
project overview, key technologies, an architectural overview,
9:26
a nice little diagram here, some core components.
9:29
and much more. If we want things to change
9:32
to this particular CLAUDE.md, we can easily do so.
9:35
As it continues searching the codebase,
9:37
it makes additional edits here to my CLAUDE.md
9:40
and gives me a summary of what's been done.
9:43
When I'm using a tool like Claude Code in VS Code,
9:46
I have the ability to specify which
9:48
file I'm in and even get information
9:49
about particular lines.
9:52
To set this up, I'm going to use the /ide command.
9:55
and I can see right here
9:57
that I'm connected with Visual Studio Code.
9:58
Now that I'm in Visual Studio Code, we can see right here
10:01
that the second that I visit a file,
10:04
it's tagged right here for what's going on.
10:06
This gives Claude Code the right context
10:08
for which file I'm in and if there are questions
10:11
I have about that file, it makes it easier
10:13
for Claude Code to identify that.
10:15
If I ever want to make any changes
10:17
to my CLAUDE.md file, I can manually write that if I'd like.
10:20
Or I can use a handy command
10:22
to go ahead and use this pound key
10:24
and directly add to memory.
10:26
So I'm just going to say here, always use UV.
10:29
to run the server, do not use pip directly.
10:32
This is a package manager in the Python ecosystem
10:35
and I want to make sure that Claude doesn't get confused.
10:37
When I use this shortcut, we can see there are different places
10:41
where this memory can be saved.
10:42
We mentioned there is the Project memory
10:45
that is included in git for everyone on your team to use.
10:48
We have local memory that is gitignored
10:51
but just useful for you as the developer.
10:53
and then User memory that is applicable
10:56
to all projects you use with Claude Code.
10:59
For this one, I'll just go ahead and update the project memory.
11:02
I can see here, I've made that change.
11:04
And if I look in my CLAUDE.md, I'll see right here,
11:07
I have some mentions to using UV
11:10
to make sure that I'm doing that correctly.
11:12
If I want to be more specific, I can also say,
11:15
make sure to use UV to manage all dependencies.
11:19
I'll add this to my CLAUDE.md and
11:21
we'll see right here that it's been added.
11:23
If I take a quick look at this particular file,
11:26
we can see any mention of dependencies now includes UV.
11:39
We spoke a little bit about some of the commands
11:41
that are built into Claude Code like /emit.
11:45
There are a couple other useful
11:46
ones that I want to showcase here.
11:48
And in fact, we're going to see later on
11:50
in this course, we can even make our own.
11:52
One of the first ones I
11:53
want to walk you through is /help.
11:54
This shows me right off the bat a quick description
11:58
of all the commands. and a quick summary.
12:00
This is useful as you're getting up to speed with Claude code.
12:04
The next one I want to showcase is a command called /clear.
12:07
What this allows you to do is
12:10
clear the conversation history and start from scratch.
12:13
This is very helpful as you shift gears and build new features.
12:17
This allows you to clear the context window and start fresh.
12:20
If you want to continue the conversation,
12:23
have a smaller context window, but still
12:25
have a summary of what's been done,
12:28
we also have this command /compact
12:30
that allows you to clear the history, but keep a summary
12:33
so that you can build off with Claude having an idea
12:36
of what was done before.
12:38
One more useful command is the escape key that allows you
12:41
to get out of whatever command you're in.
12:43
So if I'm going and trying to do something like /compact
12:47
and I want to stop that process, I can always press escape.
12:50
If I start a process with Claude Code
12:52
to explain what is in the codebase.
12:55
If I want to stop that process, escape
12:57
will allow me to interrupt and continue, onwards.
13:00
So don't feel like you have to wait for
13:02
Claude Code if you're not getting what you need.
13:04
In the next lesson, we'll start using Claude Code to build features,
13:08
add to files, modify changes, and make sure
13:11
we're doing the right thing along the way.
13:14
Before we hop off, one last useful piece with
13:16
Claude Code is its ability to work with Git.
13:18
So I've made some small changes to this application,
13:21
and I want to add and commit these changes.
13:24
Instead of me manually have to write
13:26
the Git commands, write a descriptive commit message,
13:29
going to actually have Claude Code do that work for us.
13:32
And what's really nice is Claude Code's ability to add
13:35
and commit the necessary commands.
13:37
I'll go ahead and add this particular file,
13:39
not only commit, but you can see here,
13:42
I've got this really nice descriptive commit message.
13:44
That's incredibly useful as we start asking Claude Code
13:47
about historical changes with git.
13:49
and when we push this to GitHub and
13:51
other people are reading the changes
13:53
we made. So we'll add and commit
13:54
and the next lesson, we'll use Claude Code
13:57
to start writing lots of things for us.
"""

Lesson 3 Setup & Codebase Understanding

"""
0:02
The first example we'll work on is an end-to-end RAG chatbot.
0:06
Let's use Claude Code to explore the code base.
0:09
Before we start using Claude Code
0:11
to write lots of code for us,
0:13
let's talk about how we can use this tool
0:16
to get up to speed on larger code bases.
0:19
Right here, I have an application where I can chat with Claude
0:23
about course materials from Deep Learning AI.
0:26
So let's try asking an outline of a course. For example, what
0:29
is the outline of the MCP Build Rich-Context AI Apps with Anthropic.
0:34
We'll see here that I'll get a
0:36
response with quite a bit of detail
0:38
around the lessons and descriptions for each of those lessons.
0:41
With that in mind, let's see how we can get
0:44
up to speed on the underlying code that powers this application.
0:48
Back in VS Code, I have
0:49
the terminal open here and I'm going
0:51
to hop into Claude Code just
0:53
by typing in claude and pressing enter.
0:55
In this application, I can start chatting with my codebase.
0:58
So I'm going to start with a high-level question just to
1:01
give me an overview of the codebase.
1:04
What we're going to see Claude Code do is agentically search
1:07
over the codebase, figure out some of the most important files
1:12
and give me a description of what's happening in this application.
1:15
Instead of searching through each individual file,
1:18
we're going to agentically search and find the most relevant ones.
1:21
So here we're going to get some information about
1:24
the architecture, the key components, some of the features,
1:28
and now if there are particular
1:30
things I want to dig into, I can easily do that.
1:33
I can also ask other higher level questions like how
1:36
are these documents processed?
1:38
In this application, we're using Retrieval Augmented Generation
1:42
to fetch information about these courses.
1:45
If I want to get more information about that process,
1:48
I can ask a question like this one.
1:50
We like to say that Claude Code is a fantastic
1:52
engineer alongside you,
1:54
but it's an even better explainer.
1:56
So as you're getting up to speed with new codebases,
1:59
new data sets. First, start using Claude Code
2:02
as a way to explain things to you,
2:04
so that when you ask it to write code,
2:06
you can have a better understanding of what's going on.
2:09
Here we can see the sources in the
2:12
code base that are actually splitting text into chunks,
2:15
that are adding lesson context and that are storing course metadata.
2:18
This ability to quickly get up to speed with a code base,
2:22
especially when you might not be
2:24
familiar with the underlying technology or language,
2:27
is exceptionally valuable. Instead of
2:29
navigating to each of these folders and figuring out what's going on,
2:34
we can ask more specific questions and even get diagrams
2:38
and visualizations made for us.
2:41
So the first thing I'll ask Claude
2:43
is to trace the process of handling a user's query
2:47
from front end to back end.
2:50
You can imagine you might have some limited knowledge
2:53
in one of the parts of the stack or
2:55
you're not familiar with how this is all happening.
2:58
So Claude Code is going to
2:59
give us quite some useful information here.
3:02
What's useful when you're seeing Claude Code work
3:04
is its ability to give you a bit of a to-do list,
3:07
so you can start to understand
3:09
what's happening. At any point in time,
3:12
you can press escape and guide Claude Code
3:15
to follow a different set of to-dos,
3:17
but in this case, I feel pretty good about what it's doing.
3:20
It's going to start tracing from the frontend, start following API endpoints,
3:24
analyze our Retrieval Augmented Generation system,
3:28
and then figure out how to actually generate the response.
3:31
It's reading the appropriate files that are handling these particular tasks
3:36
and finishing up its list to give us a powerful summary.
3:39
As we're in this environment,
3:41
we can stay within VS Code or open
3:43
up Claude Code in its own dedicated terminal instance.
3:47
That's completely up to you as you're working in this application.
3:50
Once it's done, we can see a
3:52
very detailed path for what's happening here.
3:55
Not only can I read each of these step-by-step,
3:58
I can even ask Claude to write this to a file,
4:00
but I'm seeing in quite a bit
4:02
of detail what's happening on the front end
4:04
with some JavaScript, what happens once that reaches my back end,
4:07
what the Retrieval Augmented Generation system is doing,
4:11
how I'm generating a response. Finally,
4:14
how I'm searching through my vector database,
4:16
how I'm filtering what's necessary, getting a response back,
4:20
and then finally, sending that to the user.
4:23
There's a lot that's going on in this application.
4:25
And I can use Claude to
4:26
dive deeper into any of those pieces.
4:29
But let's just say I learn best from visualizations.
4:32
So let's ask Claude to draw a diagram
4:34
that illustrates this flow.
4:37
We can ask Claude to draw diagrams
4:39
for web visualizations. We can ask for ASCII art.
4:43
But let's see what Claude comes up with
4:44
with its own intelligence and knowledge of how the application works.
4:49
So let's see what Claude code has come up with.
4:51
We've got a really nice diagram here
4:53
showing us the step-by-step process.
4:55
So it can't create these visual diagrams.
4:58
We could always ask it to use some something like D3.js
5:01
or recharts if we want something like a web application.
5:05
But we can see right here, we've got a really nice diagram.
5:08
From the front end, making a request to the back end,
5:11
calling the necessary functions,
5:13
generating the response necessary if there's any history involved,
5:18
talking directly to the large language model
5:21
with our system prompts and our tools and a query,
5:23
figuring out where to go next,
5:25
searching through our vector database using Chroma DB, getting back results
5:29
formatting that, sending it to the model to produce a final response.
5:34
There's quite a bit of detail that goes into this.
5:37
And if we want, we can even augment Claude with additional tools
5:41
for generating the visualizations that we want.
5:44
But out of the box, just getting this information quickly and efficiently
5:48
is going to help us get up to speed with this
5:50
codebase in a fraction of time that we used to spend.
5:54
So with that in mind, let's ask a
5:56
very simple question, how do I run
5:58
this application? You might be in a situation
6:00
where there's a new technology here, a new idea.
6:03
Very simply, it's nice to just
6:05
know how to get up and running.
6:07
I can see here, my API documentation,
6:09
my web interface, and if there are any environment variables I need,
6:13
I'm good to go. Now that you've gotten an idea
6:16
of how to just start talking to Claude Code.
6:18
Let's talk a little bit about some of the more powerful features
6:20
with Claude Code.
6:22
When you start working with an application in Claude Code,
6:25
one of the first things we
6:26
recommend you do is run a command
6:28
called /init.
6:29
You can see here in Claude Code, when I add this slash,
6:33
we have a list of many built-in commands that I can use.
6:36
/init allows me to initialize
6:38
a CLAUDE.md file with the codebase documentation.
6:42
The CLAUDE.md file is mission critical
6:45
for introducing memory for Claude Code,
6:48
so that it knows how best to work in your codebase.
6:52
The CLAUDE.md file is very useful
6:54
for specifying how you want things to be run.
6:57
This could be your tests, this could be your linting,
6:59
and any long-term memory that you want Claude to have
7:03
each time you're working with Claude Code for this particular project.
7:07
Instead of making this from scratch, /init
7:09
is going to analyze the codebase
7:11
to figure out at a high level what it should know about
7:14
each time you're working with this application.
7:18
There are three different CLAUDE.md files that you can make,
7:21
like the one generated with /init
7:23
all the way here on the left.
7:26
This CLAUDE.md file lives in your application. You can
7:29
have many of them in nested sub folders.
7:32
But this is shared with other
7:34
engineers and committed to your version control.
7:37
Another option is if you have personal instructions
7:39
and customizations, think specific for your editing environment
7:42
and terminal environment, you can put that in a CLAUDE.local.md file.
7:49
This is git ignored and not shared with other engineers.
7:53
Finally, in your home directory, in the
7:55
.claude folder, you can add a CLAUDE.md
7:57
and you can think of this like a
7:59
global claude.md for all projects on your machine.
8:03
This is helpful if you want Claude to follow instructions across
8:07
a wide range of projects that you build with Claude Code.
8:17
We can go ahead and allow Claude Code to find different
8:20
files so that it knows how best to create this CLAUDE.md file.
8:24
This CLAUDE.md file is meant to be
8:26
added to your current git project and
8:29
shared with other team members.
8:31
As more individuals work on the codebase,
8:34
they can add to this CLAUDE.md file,
8:36
and you can even nest CLAUDE.md files
8:39
in subdirectories if you need
8:41
more specific instructions for things like the backend
8:44
or frontend or our docs that we have here.
8:46
What's really nice about using a tool
8:49
like Claude Code with Visual Studio Code,
8:51
is that as I see changes to files,
8:54
I can see those visually in my editor.
8:56
And anytime that I am using a tool in Claude Code,
9:00
it's going to ask me for permissions.
9:02
This mission critical human in the loop is really important
9:05
when you get up and running,
9:07
and if you don't need Claude to ask you every single time,
9:10
can always use this second option. We'll
9:12
go ahead and auto accept those edits
9:14
and we'll see that a CLAUDE.md file has been created for us.
9:18
To give you a quick walk through,
9:21
we can see it's given us a
9:23
project overview, key technologies, an architectural overview,
9:26
a nice little diagram here, some core components.
9:29
and much more. If we want things to change
9:32
to this particular CLAUDE.md, we can easily do so.
9:35
As it continues searching the codebase,
9:37
it makes additional edits here to my CLAUDE.md
9:40
and gives me a summary of what's been done.
9:43
When I'm using a tool like Claude Code in VS Code,
9:46
I have the ability to specify which
9:48
file I'm in and even get information
9:49
about particular lines.
9:52
To set this up, I'm going to use the /ide command.
9:55
and I can see right here
9:57
that I'm connected with Visual Studio Code.
9:58
Now that I'm in Visual Studio Code, we can see right here
10:01
that the second that I visit a file,
10:04
it's tagged right here for what's going on.
10:06
This gives Claude Code the right context
10:08
for which file I'm in and if there are questions
10:11
I have about that file, it makes it easier
10:13
for Claude Code to identify that.
10:15
If I ever want to make any changes
10:17
to my CLAUDE.md file, I can manually write that if I'd like.
10:20
Or I can use a handy command
10:22
to go ahead and use this pound key
10:24
and directly add to memory.
10:26
So I'm just going to say here, always use UV.
10:29
to run the server, do not use pip directly.
10:32
This is a package manager in the Python ecosystem
10:35
and I want to make sure that Claude doesn't get confused.
10:37
When I use this shortcut, we can see there are different places
10:41
where this memory can be saved.
10:42
We mentioned there is the Project memory
10:45
that is included in git for everyone on your team to use.
10:48
We have local memory that is gitignored
10:51
but just useful for you as the developer.
10:53
and then User memory that is applicable
10:56
to all projects you use with Claude Code.
10:59
For this one, I'll just go ahead and update the project memory.
11:02
I can see here, I've made that change.
11:04
And if I look in my CLAUDE.md, I'll see right here,
11:07
I have some mentions to using UV
11:10
to make sure that I'm doing that correctly.
11:12
If I want to be more specific, I can also say,
11:15
make sure to use UV to manage all dependencies.
11:19
I'll add this to my CLAUDE.md and
11:21
we'll see right here that it's been added.
11:23
If I take a quick look at this particular file,
11:26
we can see any mention of dependencies now includes UV.
11:39
We spoke a little bit about some of the commands
11:41
that are built into Claude Code like /emit.
11:45
There are a couple other useful
11:46
ones that I want to showcase here.
11:48
And in fact, we're going to see later on
11:50
in this course, we can even make our own.
11:52
One of the first ones I
11:53
want to walk you through is /help.
11:54
This shows me right off the bat a quick description
11:58
of all the commands. and a quick summary.
12:00
This is useful as you're getting up to speed with Claude code.
12:04
The next one I want to showcase is a command called /clear.
12:07
What this allows you to do is
12:10
clear the conversation history and start from scratch.
12:13
This is very helpful as you shift gears and build new features.
12:17
This allows you to clear the context window and start fresh.
12:20
If you want to continue the conversation,
12:23
have a smaller context window, but still
12:25
have a summary of what's been done,
12:28
we also have this command /compact
12:30
that allows you to clear the history, but keep a summary
12:33
so that you can build off with Claude having an idea
12:36
of what was done before.
12:38
One more useful command is the escape key that allows you
12:41
to get out of whatever command you're in.
12:43
So if I'm going and trying to do something like /compact
12:47
and I want to stop that process, I can always press escape.
12:50
If I start a process with Claude Code
12:52
to explain what is in the codebase.
12:55
If I want to stop that process, escape
12:57
will allow me to interrupt and continue, onwards.
13:00
So don't feel like you have to wait for
13:02
Claude Code if you're not getting what you need.
13:04
In the next lesson, we'll start using Claude Code to build features,
13:08
add to files, modify changes, and make sure
13:11
we're doing the right thing along the way.
13:14
Before we hop off, one last useful piece with
13:16
Claude Code is its ability to work with Git.
13:18
So I've made some small changes to this application,
13:21
and I want to add and commit these changes.
13:24
Instead of me manually have to write
13:26
the Git commands, write a descriptive commit message,
13:29
going to actually have Claude Code do that work for us.
13:32
And what's really nice is Claude Code's ability to add
13:35
and commit the necessary commands.
13:37
I'll go ahead and add this particular file,
13:39
not only commit, but you can see here,
13:42
I've got this really nice descriptive commit message.
13:44
That's incredibly useful as we start asking Claude Code
13:47
about historical changes with git.
13:49
and when we push this to GitHub and
13:51
other people are reading the changes
13:53
we made. So we'll add and commit
13:54
and the next lesson, we'll use Claude Code
13:57
to start writing lots of things for us.

"""

LESSON 4: Adding Features

"""
0:02
Now that you have an understanding
0:03
of the chatbot codebase, let's add features to the UI
0:06
and implement a new tool for the chatbot.
0:09
Now that we've gotten up to speed on this codebase,
0:12
let's talk a little bit about
0:14
some features we might want to add.
0:16
We saw before, in this application,
0:18
when we ask for an outline of a course,
0:21
we get some really detailed information
0:23
and we even see some of the sources that are referenced.
0:27
At the same time, when we see
0:29
these sources that are referenced, it would be really nice
0:32
to be able to click on these as links and go to
0:35
the source of truth.
0:37
So we want to build an interface
0:39
where the front end and back end
0:41
are correctly rendering links to show where
0:44
this data is coming from
0:46
and not just some text.
0:48
So let's hop over to Claude and talk
0:50
a little bit about how to get started.
0:52
What we're going to do here instead of
0:54
just asking Claude to implement the feature necessary,
0:57
we're going to make use of two important pieces.
1:00
The first one is referencing the correct file,
1:03
and the second is using plan mode.
1:06
When we talk about referencing the correct file,
1:08
Claude Code is only as good
1:10
as the context that you give it.
1:12
So when you ask Claude Code to make changes,
1:15
it's important to make sure that we're figuring
1:18
out the right files we need to modify.
1:20
We can have Claude Code try to figure this out,
1:23
but if we know out of the box
1:25
what files need to be modified, giving
1:28
in Claude Code this context right
1:30
away makes the tool much more
1:31
efficient. So let's see how that's done.
1:34
I'm going to open up Claude Code and to reference a file,
1:37
I simply use this at and tag that file.
1:41
For a folder, I can reference files inside.
1:44
For a file directly, I can go ahead
1:47
and even use tab to complete for the full file name.
1:50
With that in mind,
1:52
let's talk next about the second
1:54
important piece when building features or making
1:57
larger changes. Instead of having Claude trying to figure out what
2:01
needs to be done and write the code right away.
2:04
We're going to follow a slightly
2:06
different pattern. We're going to plan first.
2:08
We're going to have Claude create a detailed
2:11
plan for what changes need to be done.
2:14
And if we approve that plan,
2:16
we're then going to have Claude Code
2:17
make changes to quite a few files.
2:19
When you have slightly larger changes to make,
2:22
we always recommend starting with plan mode
2:25
so you can give Claude the opportunity
2:27
to figure out what needs to be done
2:29
before it needs to make those changes. To activate plan mode,
2:33
I'm going to press shift tab twice.
2:35
And we'll see here that plan mode is on.
2:38
Let's showcase what needs to be done. I'm going
2:39
to bring in a prompt that I have here,
2:41
and I'm going to ask it
2:43
to build an interface with source citations.
2:46
You can notice here that I'm referencing the correct files
2:49
as well as referencing other files where changes need to be made.
2:53
So let's give Claude the opportunity to come up
2:56
up with a plan for how to solve this particular problem.
2:59
As always, it's going to read through
3:01
the files that it thinks are most necessary.
3:03
It's going to trace its way from the front end
3:06
to the back end and understand what needs to be implemented.
3:09
Once we finish getting a plan, we're going to have the opportunity
3:12
to either approve it or to give Claude
3:14
some feedback for what might need to be changed.
3:17
But here, Claude is not directly writing any code.
3:21
As we see here, we can accept and
3:23
then continue to auto-accept edits so we can
3:25
don't have to keep asking for permission.
3:27
We can manually approve them or we
3:29
can tell Claude to change the
3:30
plan. Taking a quick look at this,
3:32
I feel pretty good about what we need to do.
3:34
So let's use that plan with our auto-accept edits.
3:37
If you ever want to turn this on on its own,
3:40
you can press shift tab just one time.
3:42
We'll see the to-do list necessary.
3:45
We'll see what changes need to be made.
3:47
And now we're going to let Claude Code
3:49
write to the files that it seems necessary,
3:51
and then we can test that the implementation works correctly.
3:54
correctly. We'll see here, files are being modified,
3:57
changes are being made to the codebase.
4:00
And since we added the auto
4:01
accept, we don't have to keep giving
4:03
permission over and over.
4:05
Very common workflow that we see is users start by asking
4:10
for permission each time.
4:11
And as more trust is given by the human to Claude Code,
4:15
the auto-accept edits come on a bit more.
4:17
We can see here finally, that we
4:19
can start the application to test the implementation.
4:22
But in fact, the server is running already.
4:25
So I'm just going to tell Claude, no, thank you.
4:27
I'll say right off the that, the server is running.
4:30
No need to start it yourself.
4:32
If I want Claude Code to always do that,
4:35
this is a great opportunity to just
4:37
put something into the CLAUDE.md file as well.
4:40
Now that I've let Claude Code know that, it's
4:42
going to tell me the changes that have been made.
4:44
So let's test this. Now let's try asking the same question.
4:48
Let's ask for an outline of a course.
4:51
And if this has been built
4:52
correctly, you should be able to see
4:54
links below for each one of these particular features.
4:58
If I take a look, right here I have links
5:01
that will take me to the right place,
5:03
but the interface is a little bit difficult to see
5:06
because of this blue link color.
5:09
If I'd like, I can go ahead and ask
5:11
Claude Code to make the change necessary to do so.
5:14
So let's go and follow up with Claude
5:16
and ask it to make this interface a little bit more pleasant.
5:19
One option that I have here is just to tell Claude.
5:23
here is what I want. Another option is to use Claude's visual
5:26
ability to take a look at a screenshot
5:29
and analyze what needs to be changed.
5:32
So let's take a screenshot of what this interface looks like.
5:35
and we're going to go ahead and paste that into Claude Code.
5:39
Back in Claude Code, when I
5:41
paste that screenshot, I'm going to say,
5:44
these links are hard to read.
5:45
Can you make this more visually appealing?
5:49
We're going to go ahead and give Claude the ability to analyze
5:52
that image and figure out where things need
5:54
to be changed on the front end.
5:56
And we can see here I can see the issue.
5:58
The links are using a default blue color.
6:01
Let me go ahead and make a change.
6:03
When you need Claude Code to make visual changes,
6:06
taking screenshots and showing Claude Code the screenshot
6:09
is a very powerful way of quickly iterating against what we need.
6:13
Let's go back to the browser
6:14
and see what things look like now.
6:16
We'll ask again for an outline of a course.
6:19
And if this is done what we've
6:21
expected, we should see that these links
6:22
are a bit nicer to take a look at.
6:25
Let's take a look at our
6:27
sources and look at that. Much better.
6:29
The ability for Claude Code to see screenshots and make changes
6:33
is one of the most commonly used features we see
6:36
and incredibly valuable to build things quickly.
6:38
If I want to see those changes to files,
6:40
I can open those up in VS code
6:43
and Claude Code here will notice I'm in that particular script
6:46
and I can ask questions and get information necessary for those files.
6:50
files. This is looking good. Let's add a new feature.
6:54
Instead of building off in the context window what I have now,
6:59
I'm going to start completely from scratch and clear the conversation history.
7:04
This is going to allow me to
7:06
have a longer context window to work with
7:09
and not have Claude get potentially
7:11
confused with things that it's seen before
7:13
that are not relevant to what I'm building now.
7:16
As we saw before, when we want to build newer features,
7:19
we're going to use plan mode.
7:21
In this particular application, I want to add the ability
7:25
to start a new chat in my interface.
7:28
So instead of having to refresh the page each time,
7:31
I'd love for a button here to allow me
7:34
to reset the conversation and start a new chat again.
7:38
So let's build that. I'm going to activate plan mode.
7:40
and I'm going to go ahead and
7:41
bring in the prompt that I have here.
7:43
I'll ask Claude Code to add a new chat button
7:46
and when clicked, it should clear the conversation in the chat window.
7:49
start a new session and handle the necessary clean up.
7:53
If you ever need to make
7:54
a new line and add more context,
7:57
you can use backslash and press enter.
7:59
So if there is more I want
8:00
to add here, I can easily do so
8:02
that's a bit more visually appealing.
8:05
So let's have Claude Code figure
8:06
out what needs to be built here.
8:08
As we saw before, if there are
8:09
changes to the front end that we need,
8:11
it will find the necessary folders,
8:13
changes to the back end, the same kind of thing.
8:16
And here, it's going to come up with a comprehensive plan.
8:18
This idea of being able to plan and think before taking actions
8:23
is incredibly valuable to build the interfaces that you want.
8:27
I can take a quick look through this plan. I
8:29
can see what it's trying to do and I feel good,
8:32
so let's build it. If at any point
8:33
in time, I don't like what's being done,
8:36
I can always press escape and
8:38
navigate Claude Code in a different direction.
8:40
As always, we'll see our to-do list that needs to be built.
8:43
We'll see these files being updated
8:45
since I have auto accept edits on and
8:48
once that's done, we'll move on to the next step.
8:50
We'll start seeing some JavaScript being added
8:53
for when clicks occur, starting new conversations.
8:56
We'll see clearing inputs and focusing,
8:58
and now building a little bit of styling to match existing sections.
9:03
We can see here, it's going to test the new functionality.
9:06
And if I need to tell Claude to not run
9:08
the server, I can gladly do so if I want.
9:11
So here, instead of running the server,
9:12
I'll just tell Claude, don't do it.
9:14
And since I'm going to find myself
9:16
doing that a lot, now is a good
9:17
at the time to say,
9:18
don't run the server using
9:20
./run.sh
9:22
I will start it myself.
9:24
I'm going to put this actually in the project memory.
9:27
If I want all other developers to do the same.
9:30
But maybe other developers might want to run the server themselves.
9:34
So I'll put that in the
9:36
project memory that's local and git ignored.
9:39
So this might be a situation where
9:41
I like to run the server myself,
9:43
but maybe other developers don't. Great use case for that Claude
9:46
local MD file. Now let's go back
9:48
to the browser and see what we built.
9:50
I'll refresh the page. And we've got this new chat button here.
9:53
Let's see if it works. We'll ask
9:55
again for an outline of the course.
9:57
We can make sure that our source links look great.
9:59
And if this does what's expected,
10:02
we can click on this button and start a new conversation.
10:04
That's looking good. Let's start a new chat.
10:07
So, even though this is working,
10:09
it still doesn't look exactly the way that I want.
10:12
And I can take screenshots and go back and forth with Claude.
10:16
or I can enhance
10:18
the tools that Claude Code has
10:21
out of the box using MCP servers.
10:25
MCP or the Model Context Protocol,
10:28
allows for tools like Claude Code
10:31
to gain additional functionality
10:33
to external data sources and systems.
10:36
What I'm going to do here
10:38
is add an MCP server for Playwright,
10:41
a popular tool for opening up a browser,
10:44
taking screenshots, and analyzing those screenshots. So instead of me manually
10:49
having to take the screenshot and have a conversation with Claude,
10:53
we're going to let Claude do it all by itself.
10:56
The first thing I'm going to
10:57
do is quit out of Claude Code
10:59
and add the necessary MCP server.
11:02
And the command to do so is claude
11:04
mcp add, the name of our MCP server, which is playwright,
11:09
and then the underlying command to start that MCP server.
11:13
That is done using npx @playwright/mcp@latest.
11:19
For any MCP server that you want to include,
11:22
you can reference the documentation.
11:24
All MCP servers will specify the necessary
11:27
command to connect to that particular server.
11:31
Let's open up Claude again and we'll
11:33
see what our MCP server looks like.
11:35
We can use the /mcp command
11:37
and here we can see that we have connected successfully
11:41
to the Playwright MCP server and we can see the tools
11:44
available that the Playwright server is giving us.
11:47
Things like evaluating JavaScript, uploading files,
11:51
pressing a key, navigating, going back.
11:54
All of these things that we might manually test,
11:56
Playwright can do that programmatically for us.
12:00
I'll press escape to go back a few times,
12:02
and let's ask Claude Code to navigate
12:05
to figure out how to build the necessary
12:07
content. So let's go and ask Claude Code
12:10
using the Playwright MCP server
12:12
visit the page that we're at
12:15
and view the new chat button.
12:18
I want that button to look the same as the other
12:22
links below for Courses and Try Asking.
12:27
Make sure this is left aligned
12:30
and that the border is removed.
12:33
Before it starts taking this action,
12:35
it's going to ask me for approval for these particular tools.
12:39
We'll see that it will visit
12:40
that page, take a screenshot and do do what's necessary.
12:44
Let's follow that and not ask for
12:46
permission each time to use this particular tool.
12:49
We can see here that the browser has opened a
12:52
new tab programmatically to our page to take a screenshot.
12:56
We'll ask Claude Code to take that screenshot
12:58
and analyze what it sees.
13:01
Here it can see the exact issue that's happening and instead of
13:05
us manually having to take the
13:07
screenshots necessary, it can programmatically fix itself.
13:09
We could have a more specific prompt as well, that keeps asking
13:13
Claude Code to make those changes necessary.
13:15
Since I don't have auto accept on, I can see the change
13:18
that's being made in VS Code.
13:20
And right out of the box, I don't
13:22
see a border and background with this
13:23
new change. That looks good to me.
13:25
Let's make those changes and continue making other changes.
13:28
I can see left align looking good.
13:31
and any other changes that need to be made here.
13:34
It's going to take another screenshot to
13:36
verify that the changes it's made look correct.
13:38
that it has the right icon prefixes used.
13:41
match other sections. With that in
13:43
mind, let's go see how he did.
13:45
I'm going to refresh the page. and it's looking good.
13:48
It's got an extra plus here. So why don't we go ahead
13:50
and ask it to take that
13:52
out. But it's left aligned and it's
13:53
using the icon that we like before.
13:56
So let's go ahead and fix this up and say,
13:59
there are now two plus icons, remove the
14:01
one closer to the text "+ New Chat"
14:04
We can see here there's already a plus in the HTML content,
14:07
so we'll remove that and let's see
14:09
what's done here. So instead of adding
14:11
that extra plus, we can see here what's being done.
14:13
If we need another snapshot, we
14:15
can visit and take a snapshot necessary.
14:18
As we can see here, Claude Code
14:20
saw there was not an open tab, so it fixed itself,
14:23
opened it up again and took the necessary screenshot.
14:27
Let's see what that looks like now. Much better.
14:30
As you can imagine, building complex interfaces
14:33
using tools like MCP playwright
14:36
makes building, designing and testing a breeze. We've made some really
14:40
nice front end changes. Let's now go and visit the back end.
14:43
Like we did before, we're going to start
14:46
fresh and instead of building off of this
14:48
conversation, we're going to start with a new one.
14:50
So let's clear the conversation history and start again.
14:54
This time, we want to build some features on the back end.
14:58
So let's put in a prompt, talk
14:59
about what's going to be done here.
15:01
I need to add another tool
15:03
that allows me to visit a particular course
15:07
and for each of those courses, see the
15:09
lesson number and the lesson title and description about that as well.
15:14
Right now, the data that I get
15:16
when I take a look at a course
15:18
is relatively high level. Let's see what I mean.
15:21
What we're going to ask Claude Code to do
15:23
here is to make a change to our search_tools.py file.
15:27
Let's take a look at that. And
15:28
in this file, we can see right now
15:30
that we just have one tool for searching
15:34
content and getting details about that particular course. This second tool
15:39
is going to allow us to get more descriptive information
15:43
for each of the lessons in these courses.
15:45
So let's see what Claude can do. As we've done previously,
15:49
let's make a plan and make
15:51
sure we're first okay with that plan
15:53
before we start making changes to individual files.
15:56
Claude Code can see the current
15:57
architecture, had to implement the outline tool,
16:00
and since we have that CLAUDE.md
16:02
previously, it's going to more quickly be able
16:04
to understand what needs to be done.
16:07
We can take a look at what needs to be implemented,
16:09
we can make sure that we're doing
16:11
the right things in the right files.
16:12
We can see that once we create this tool,
16:15
we update the system prompt to make
16:17
sure that we get that additional data,
16:19
and then we register that tool in our RAG system.
16:22
As always, if there's anything we want to
16:24
change or suggest, we can do that now.
16:27
But let's see what Claude Code can do for us.
16:29
If this works as expected,
16:31
we should be able to ask questions about a
16:34
course and get much more detail for those particular
16:37
lessons in the course.
16:39
We can see here that not only are we
16:42
modifying the underlying Python code, but also the system prompt
16:44
and here we're registering that new tool that we've made.
16:48
Once we finished our to-do list,
16:50
we can head back to the browser
16:52
and see what things look like
16:54
and if this has been implemented correctly.
16:56
We'll see a nice summary of what's been made
16:58
and we can always change things at any point in time.
17:01
Back in the browser, let's go ahead and try asking
17:04
for some information about a course.
17:06
If this works as expected.
17:08
We should be able to get more detailed information
17:11
including a link for that particular course.
17:14
Here, we can see the names of the lessons
17:16
and if we would like, we can even build additional functionality
17:20
to get sources for each one of those.
17:22
In the next lesson, we'll talk about what happens
17:25
when things go wrong and how we can use
17:27
Claude Code to debug, to write tests,
17:29
and make sure that we feel confident in
17:32
the software that we're writing alongside Claude Code.
"""

Testing, Error Debugging and Code Refactoring
Video
・
12 mins

"""
0:00
The codebase is now missing tests
0:02
for evaluating the RAG pipeline of the chatbot.
0:06
Let's implement these tests and use them to debug an error
0:09
that the chatbot is having processing the queries, and finally, refactor
0:14
how the chatbot handles its tool use. Let's dive in.
0:18
So far we've seen how to get up to speed with codebases
0:21
and implement features to build a slightly more powerful experience.
0:26
Now let's go ahead and imagine that it's
0:28
been some time since we've worked on this
0:29
application. We're coming back and we want to start using it again.
0:32
So let's hop back to our application
0:34
and ask for some details on what's covered in Lesson 5.
0:38
We might expect to see a response
0:40
that gives us information, but right now, something's wrong.
0:43
It might be tempting to just
0:45
copy this error, put it into Claude,
0:46
take a screenshot, hope it solves the problem.
0:48
But we're going to do something a little bit different.
0:51
Instead of just getting the answer that we might want
0:54
or leading Claude on some wild goose chase.
0:58
We're going to take a bit more of a methodical approach here.
1:00
We know that things are wrong in our application,
1:02
but we also know that we don't have too many tests here
1:05
to programmatically verify that that's the case.
1:09
So what we're going to do is put in a prompt
1:11
that not only mentions what the error is,
1:13
but also specifies where we need to write tests.
1:17
If we go back to our code base,
1:19
the error we're looking at could be
1:21
from a variety of different Python files.
1:24
In our AIGenerator, this is where we handle interactions with Anthropic's API.
1:28
And there could be problems in the prompt
1:31
or even some of the logic
1:32
we have for getting this part working.
1:35
In our rag_system.py,
1:36
this is the orchestrator for everything that's happening with Retrieval Augmented Generation.
1:42
And in our search_tools, here's where we define the underlying tool
1:46
definition where there could potentially be problems.
1:49
So what we're going to ask Claude to do
1:51
is write tests for these specific files just to start.
1:54
We're then going to ask Claude to run those tests
1:56
and through that, verify what is not working and make
1:59
the appropriate fix. What's so powerful about this approach
2:03
is by starting with our tests, we
2:05
can start to build a robust foundation
2:07
for building more off of the codebase
2:09
and understanding when things go wrong, why they're failing.
2:12
So let's open up Claude and put in a prompt.
2:15
Since this is a little bit more challenging,
2:18
we're also going to ask Claude to think a lot.
2:22
This is going to trigger Claude's ability
2:24
to enable extended thinking
2:26
and allocate a few more tokens
2:28
towards the thinking process. we're also going to see this process
2:32
and if something doesn't appear right, we
2:33
can always stop Claude in its tracks.
2:35
We'll go ahead and make sure the plan mode is on
2:38
because first we want to make sure before Claude starts writing tests,
2:41
it understands what it needs to
2:43
do and we can approve that process.
2:45
As we start to read the files necessary,
2:47
we're going to see Claude's thinking process.
2:49
We're not only going to see the files that we're reading,
2:52
but also what it needs to examine and what it should do.
2:57
So let's go see what Claude's plan has. It's
2:59
It seems like there's some kind of configuration issue,
3:02
maybe some complex tool calling with failure points
3:05
and some limited error propagation between components.
3:09
So it's possible that the error is just getting caught somewhere.
3:12
It's then going to propose a structure for tests
3:14
based on these files, which looks good to us.
3:18
use the pytest framework and mock whatever
3:19
it is in ChromaDB that we need
3:21
to get some unit tests and integration tests up and running.
3:26
You can see right now it's starting to make
3:28
a folder for my tests, where it'll be running.
3:29
writing these. It's a great start.
3:32
We'll go ahead and make sure we add
3:34
any necessary dependencies here as well with UV.
3:38
Let's go install our dependencies,
3:40
make sure we have pytest working as expected, and that looks good.
3:42
We're also going to see the thinking part
3:44
here to make sure that we're doing what's expected.
3:46
As we start to write these particular tests,
3:48
we can start exploring the code that's been written for us.
3:51
Here we can see tests for the course search tool,
3:54
fixtures and mocks that we need to make.
3:56
This looks like a good start. We'll
3:58
see the same thing for our AI generator.
3:59
and our RAG system and our vector store.
4:02
It seems like it's identified a critical
4:03
config issue which may solve the bug,
4:06
but writing these tests is going to give us complete assurance
4:08
that this is actually the problem
4:10
and that this is the correct fix.
4:20
Now that we've created these tests, let's run them using UV.
4:23
Let's go make sure we have the correct dependencies
4:25
so that we can run those tests as expected.
4:27
So from its finding, it's telling us that it's
4:29
seems like there's something wrong with these max results
4:33
or the number of chunks that were
4:34
returning when we perform our vector search. So let's see
4:38
what we're getting when we take a look at our MAX_RESULTS.
4:40
And this confirms the issue that we have.
4:42
For some reason, this happens to be zero.
4:44
Once we go ahead and change this, we should expect
4:46
that not only our tests are working as expected,
4:49
but that the results we get are complete.
4:51
We can verify this by taking a look and
4:53
making sure we get the file that we expect.
4:55
Now that Claude Code is wrapping up,
4:57
it can provide a comprehensive summary of its
4:59
findings, which I can wait to
5:01
see or if I feel good now,
5:02
I can stop Claude in its tracks.
5:05
But I'll take a look at what
5:06
it gives me. It's completed its debugging.
5:08
It's found the critical issue, and it's created a few tests,
5:11
as well as some infrastructure to
5:12
keep running tests as we go forward.
5:15
Let's go see if this worked as expected.
5:16
Back in the browser, I'll start a new conversation,
5:19
and let's ask that same question again and
5:21
see if we get the result as expected.
5:23
Instead of the query failing, we should expect to see information
5:27
just about the lesson and that's exactly what we did.
5:29
we have here. So not only have
5:31
we fixed the bug, we built for ourselves
5:32
a powerful infrastructure to keep running the application off
5:34
of and make sure that as we make new changes,
5:37
things are not breaking and we don't know why.
5:40
Now that we got this application working,
5:42
let's talk about a little bit of a refactor
5:44
that I'd like to make in the codebase.
5:46
Let's clear and start again with a new feature.
5:49
So here in our ai_generator.py,
5:51
we specify that we want one search per query maximum.
5:55
While this leads to the expected behavior for relatively simple
6:00
when we want to start doing more complex queries,
6:02
comparing different courses, comparing their outlines,
6:05
we're going to need more than one tool call.
6:08
So what we're going to need is some kind of environment
6:10
where we can either iteratively go through all the tools necessary
6:14
or recursively solve that problem.
6:17
If you're comfortable with this code and ecosystem,
6:20
you can take a look at the class that we have here,
6:22
which is a relatively simple way
6:24
to talk directly to Anthropic models
6:26
using our SDK, set your base_params and
6:29
generate a response. But you can see
6:31
here, as we build our system prompt,
6:33
as we figure out the messages necessary and any tools,
6:37
there's no iteration and back and forth to accumulate
6:40
our tools necessary and have a
6:42
multi-turn conversation with multiple tools being used.
6:46
So let's refactor that. I've got a pretty long prompt here,
6:49
so I'm going to go ahead and make
6:50
a new markdown file and let's go call this
6:53
backend-tool-refactor.md
6:56
In this file, I want to walk through the
6:58
prompt that I have where I'm
6:59
going to ask Ask Claude to refactor
7:01
the backend ai_generator.py
7:03
to support two calls in separate rounds.
7:06
The current behavior is what I'm describing
7:08
as well as the desired behavior.
7:10
While this might not be required,
7:12
it's often helpful, as we've seen,
7:15
to give Claude as much information as possible,
7:17
especially when the tasks are a little bit more complex.
7:20
We're also going to give Claude an example flow.
7:23
Something like search for a course that
7:25
discusses the same topic as another course.
7:28
Just to give Claude a sense of what needs to be done.
7:30
Notice here, there are a couple of different
7:32
tools that need to be used as expected.
7:34
We'll give Claude some requirements,
7:36
and then a couple of notes as well
7:38
to make sure we're doing the right thing.
7:40
We're going to make sure that
7:42
we write tests that verify external behavior
7:44
instead of worrying about internal state details.
7:47
Or we're also going to ask Claude to
7:49
do is figure out a couple different plans.
7:52
Don't implement any code,
7:53
but dispatch two subagents to brainstorm potential options.
7:58
In this situation, I'm not exactly sure what the optimal refactoring is.
8:03
So instead of letting Claude Code decide just one
8:05
option, I'm actually going to give it the opportunity
8:07
to figure out multiple options in parallel.
8:11
So let's use that particular prompt
8:12
and I'll turn off auto accept to make sure
8:15
that as I'm going through, I can
8:16
confirm each of the changes that
8:18
I want. So let's run that prompt.
8:20
We should expect to see the two parallel subagents
8:23
being dispatched using a tool called task.
8:26
And as we see those agents dispatched,
8:28
we'll start to see two plans
8:30
for how we can solve this problem.
8:32
It's then up to us to decide which one to implement.
8:35
We can see that both of these are operating in parallel,
8:38
reading across files and figuring out two different approaches for this refactor.
8:42
So it looks like it's come back with
8:44
some recommendations for how best to tackle this.
8:46
One approach is iterative, another more comprehensive.
8:50
We can see here that Claude is actually going
8:52
to give us an option to choose either option B
8:55
for better long-term maintainability or option A for a safer implementation.
8:59
scroll up more. If I scroll up more, I
9:01
can get some details into what it's trying to do.
9:04
One option supporting some iteration for handling tools,
9:07
the other for a slightly more complicated implementation
9:11
for multi-round logic with different helper methods for that process.
9:15
From first glance, it seems like approach A is a bit simpler.
9:18
So why don't we start with
9:19
that? I'm going to select approach A,
9:20
but I'm also now going to enable plan mode
9:23
to make sure I have a comprehensive plan and
9:26
can accept before making the changes that I want.
9:29
Let's implement approach A.
9:30
and get a more detailed plan to verify
9:32
that this is exactly what we want to do.
9:34
We know that there needs to be some modification
9:36
in the way that which we call these tools,
9:39
but let's make sure this is all being
9:40
done in the right place before we go ahead
9:42
and have Claude Code write the solution for us.
9:45
Now let's take a look at what's being done here.
9:47
We'll update our method signature for a maximum number of rounds,
9:50
update our system prompt, and here where the
9:53
core refactoring is done in our handle tool execution.
9:56
If this is done as expected, we
9:57
should see the user query, we should see
9:59
multiple tools being called and then a final response.
10:03
This shouldn't modify anything else and should solve the problem for us.
10:07
We can see here that this is backwards compatible,
10:10
and we're not changing the internal RAG system or any API endpoints.
10:14
So let's proceed and see if
10:16
this can solve our problem for us.
10:17
As we see what's being implemented,
10:20
we can see changes to existing methods,
10:22
and most importantly, we can see here that
10:25
we're updating the tests and running the tests
10:27
to verify that the implementation works correctly.
10:31
Instead of context switching to the browser
10:33
or asking other people to test,
10:35
I can do this all from inside the terminal
10:37
in Claude Code.
10:45
So we'll see here, we're going to update our system prompt,
10:47
make sure that our tests are as expected.
10:50
And then we'll add a test to make
10:51
sure the sequential tool calling works as expected.
10:54
Let's run our tests, make sure they're passing as expected.
10:57
Let's verify in the browser, this is doing what
10:59
if you want. Let's try asking first
11:02
for a details of a course's lesson.
11:06
So here we can see
11:07
that not only are we getting this information,
11:10
but also the title here as well, as expected.
11:12
We're getting information about this lesson,
11:14
as well as some of the sections and topics discussed.
11:18
Now let's do something a little more complex.
11:20
What's so special about seeing the title here is
11:22
that we don't get that with just one tool call.
11:25
The first tool call just gives us an outline of the course.
11:29
The second tool call gives us that detail
11:31
of the particular lesson and in our case the title.
11:34
Now let's ask, Are there any other courses that cover
11:37
the same topic as Lesson 5 of the MCP course?
11:42
In order to do this, we're going
11:44
to need to make multiple tool calls
11:45
to get information about this particular MCP course
11:48
and outline and then information about other courses and their outlines
11:53
to see if there's any overlap.
11:55
Unfortunately, it looks like there are no other courses
11:58
that cover building an MCP client, which does seem accurate.
12:01
In this lesson, we've seen how to use Claude Code to
12:05
not only fix bugs, but write tests throughout the entire process.
12:09
We built for ourselves a solid foundation to keep coding on
12:12
and made a nice refactor to get more complicated query answers appropriately.
12:17
In the next lesson, we'll improve our
12:20
productivity by running multiple sessions of Claude Code
12:23
and making sure we don't have overlaps or
12:26
overwrites using Git worktrees. I'll see you there.

"""

L1: Adding Multiple Features Simultaneously

"""

0:02
You can open multiple sessions with Claude
0:04
Code to work on many features in parallel.
0:08
To manage these sessions and make sure you're not
0:11
overwriting the same file, you can use Git worktrees.
0:14
So let's add Git worktrees to add
0:16
three features to the chatbot in parallel.
0:19
I'll see you there. So I'm going to hop back into Claude.
0:21
And as we saw earlier, Claude Code comes built in
0:24
with quite a few slash commands.
0:27
But you can also make your
0:28
own. To make your own custom commands,
0:29
inside of the dot claude folder.
0:32
Let's make a new folder called commands.
0:34
And inside of here, we're going to make a markdown file
0:38
with the name of the command that we'd like.
0:40
The command here that I'm going to make is called implement feature.
0:44
So I'll create a markdown file called implement-feature.md
0:48
Inside here, I can place whatever I'd like.
0:51
But what I want to show you that's very special
0:54
is if you have any arguments you
0:56
want to pass to your custom command, you can reference it using
1:01
this $ARGUMENTS variable.
1:03
So what I'm asking for here
1:04
is that when this command is used,
1:06
I'll be specifying that you're implementing a new feature.
1:09
The user can then specify whatever that feature is,
1:13
and then I want to make
1:14
sure that Claude Code is well aware
1:15
to only do this for front-end features,
1:18
and to write the changes made to a file called frontend-changes.md
1:22
You can imagine there are many different use cases for custom commands,
1:26
certain ways you want to run tests or run files.
1:29
and anything that you put in here
1:31
does not automatically get added to your context,
1:34
unlike a CLAUDE.md
1:36
So if you want something to be applied
1:39
to every single instance of Claude Code that you make,
1:42
use your CLAUDE.md file.
1:44
But if you just have specific commands
1:46
that you may or may not use across different conversations,
1:50
right here is a great place to put them.
1:52
I'm going to be using this custom command
1:54
when I start talking about worktrees.
1:56
But before we do that, let's quit out of Claude Code,
1:59
hop back in and just verify
2:01
that we can see that custom command.
2:04
And here, I see implement feature, and I see the description
2:07
is coming from the first part of this markdown file.
2:10
Now that I've added this custom command,
2:13
let's go ahead and add and commit it.
2:15
I could do this from the command line,
2:17
but I'm actually going to ask Claude to do that for me.
2:20
Add and commit changes made.
2:22
This is nice so that Claude Code can create
2:24
a nice commit message
2:26
with some descriptive information for what was done.
2:29
We'll see that it's adding the .claude folder
2:31
and committing with the commands necessary.
2:34
We can see here that this has been added to the repository.
2:37
And since we've granted permissions for this already,
2:40
we don't have to respond again.
2:42
If you're ever curious where that lives,
2:44
inside of the claude folder,
2:46
there is a settings.local.json file
2:49
Inside of this file, we can specify
2:52
what commands we've allowed so that we don't need
2:54
to confirm every single time.
2:57
As you can see here, as well,
2:58
when we use playwright, we gave permissions.
3:00
And if you'd like to add your own,
3:02
you can easily do so in this file,
3:04
or even with the handy /permissions command.
3:08
Now that we've got that custom command set up,
3:10
let's talk a little bit about how we
3:12
might want to work in parallel with Claude Code.
3:14
Instead of just opening up multiple terminal
3:17
windows and working directly on this code base,
3:20
we're going to use Git to make sure
3:23
that we don't overwrite existing files when we have
3:27
multiple instances of Claude Code.
3:29
I might have two different instances of
3:31
Claude Code operating on the same file.
3:34
And if I do that with
3:35
the environment that I'm in right now,
3:37
there's going to be overwriting, bug
3:39
creation and quite a bit of confusion.
3:42
Thankfully, Git has an excellent option here
3:44
to use a feature called worktrees.
3:46
And worktrees allow me to essentially create copies of the codebase,
3:51
operate in isolation,
3:53
and then at the end, merge those in together. And in fact,
3:57
I can use Claude to help with that merging
4:00
and management of my worktrees.
4:02
To get started with worktrees,
4:03
I'm going to first make a folder called .trees
4:06
And inside of this worktrees folder,
4:09
I'm going to go ahead and add a couple worktrees.
4:12
Let's add a work tree using the Git worktree add command.
4:15
and then we'll specify the folder as well
4:19
as the name of the work tree that I want to add.
4:21
We'll call this one ui_feature. We'll
4:23
then go ahead and add another one
4:26
called testing_feature,
4:27
and then finally a third one called quality_feature.
4:31
To confirm I've created all of these, I can take a look
4:35
and I can see that I'm on the main branch currently
4:37
and that I've created three separate worktrees.
4:40
To set up correctly in each of these environments,
4:43
I'm going to open up the trees folder,
4:46
and I'm going to open up
4:47
a terminal for each one of them.
4:49
I'll start with my ui_feature and bring that over here.
4:53
I'll then go ahead, bring in my testing feature,
4:55
and I'll move that right to the side.
4:57
Finally, let's bring in our quality_feature.
4:59
Go ahead, bring that over up here.
5:02
To give us a little more
5:04
room, we'll make this a bit smaller.
5:05
And now we have three dedicated terminal windows.
5:08
And we'll hide the explorer as well.
5:10
Now, let's open up Claude for each one of these environments.
5:14
What we can do now is run Claude Code in parallel and
5:18
make sure that if the same files are modified, we're not overwriting
5:23
and we can fix that later
5:24
when we merge in these worktrees.
5:26
I'm going to use this implement-feature command.
5:29
And then I'm going to put in
5:31
a particular feature that I'd like here.
5:33
And that feature allows me to add a
5:36
toggle button to switch between dark and light themes.
5:38
So let's go ahead and create a toggle button, position it,
5:42
and make sure that I can navigate for this particular toggle button.
5:46
We'll start with this part and
5:47
then add in the light theme variant.
5:49
While this is running, I can now move to another work tree.
5:53
And in this second work tree, let's start thinking
5:55
a little bit about what I
5:57
want to do for this testing framework.
5:58
going to pass in a prompt here to enhance
6:01
the existing testing framework and add additional tests for FastAPI endpoints.
6:06
While that's going, let's add some essential
6:08
code quality tools to our development workflow.
6:11
As we do this, we can start
6:13
to see that changes are being requested.
6:15
So let's go ahead and shift between these
6:17
environments and confirm the changes that
6:19
we want. Our tests are being written
6:21
and our additional development dependencies for analyzing
6:25
code base structure and formatting are being added as well.
6:28
What we're going to see here
6:30
is that we're modifying a file called pyproject.toml
6:33
And we're also going to see that there's a request being added
6:37
to edit that particular file as well.
6:40
As we continue these options
6:42
will make edits to these files,
6:44
and we'll go ahead and see at the same time
6:46
that our front end code is being done as expected.
6:48
We can work in parallel and make sure
6:51
that none of these particular changes are being overwritten by
6:55
other parts of the codebase. If there happen
6:57
to be changes that we've made to similar files,
6:59
we can ensure that those merge conflicts are fixed.
7:02
and we can do that using Claude.
7:04
Our front-end changes are being written,
7:06
we're adding more tests, and we're adding some
7:08
formatting tools and development scripts for quality checks.
7:12
So we're going to proceed as expected,
7:13
making sure that quality scripts are being done,
7:16
and it looks like our front-end features are being added.
7:19
Now, add that light theme,
7:21
the same way that we did previously. We'll use our implement feature,
7:24
custom command to make sure we're writing that to our change log.
7:28
and we'll add a light theme as
7:29
well. Once that's done, we'll go ahead and
7:31
cue up a few other prompts we'd like
7:34
for JavaScript functionality and implementation details.
7:36
So while that's running, I can check in on other scripts.
7:39
I can confirm I want to run those,
7:41
and if there's something going on, Claude Code can fix per necessary.
7:45
Seems like there are some scripts that Claude doesn't know about,
7:48
so we'll go ahead and either install dependencies
7:50
or make sure we're running things as expected.
7:53
You can see here, we're starting from code quality checks.
7:55
We've written our API endpoint testing and we're adding more
7:59
front end functionality. Once this is all
8:01
done, we can head over to the browser.
8:03
We can confirm our checks are done,
8:04
but before we go ahead and do that,
8:07
let's bring in all of these individual changes.
8:09
If we wanted to run the tests,
8:11
we can confirm this is as expected.
8:13
We want to head to the browser
8:14
for our UI testing, we can do so.
8:16
And here we can see Codebase formatting is done, Development scripts have
8:19
been added, and documentation has been
8:21
updated. We saw before there was a
8:24
the pyproject.toml file that was added across two different worktrees.
8:27
So there might be some conflicts when figuring out these individual pieces.
8:31
Now that we feel good about each
8:33
of these changes, let's add and commit with a descriptive message.
8:37
Let's also do the same thing on this work tree.
8:39
Since we're going to be merging in these particular commits,
8:42
we're going to want to make sure we have descriptive commit messages
8:44
we can understand what was done in each of these worktrees.
8:47
We've committed this particular commit,
8:50
we're doing the same on this one right here.
8:52
We finished up our UI enhancement. So let's do the same.
8:55
add and commit with a descriptive message.
8:58
If you find yourself writing these kinds of
9:00
prompts like add and commit with a descriptive message,
9:02
this also could be another use case for
9:04
a nice custom command where we can specify
9:07
exactly some styling that we want or the
9:09
way that our company operates with best Git practices.
9:11
Now that I finished committing across all three of these,
9:14
I can now go back to my
9:16
main branch and merge some things in.
9:18
So I'm going to close these terminal
9:19
environments and hop back to our main one.
9:22
So now I'm going to ask Claude...
9:23
To use the Git merge command
9:26
to merge in all of the worktrees in the .trees folder
9:30
and fix any conflicts if there are any.
9:33
So let's have Claude Code merge all of these particular trees
9:37
and make sure that they work as expected.
9:39
We can see here there are three worktrees available.
9:41
So we're going to start by merging in each of these worktrees.
9:44
We'll confirm this is the command we want to use,
9:47
and then this should work as expected.
9:49
Looks like our testing feature doesn't have any conflicts.
9:52
Let's bring on our UI feature.
9:54
And again, we could write these commands on our own,
9:56
but Claude Code knows exactly what to do from our prompt.
9:59
Now we can merge in the quality feature branch.
10:01
And here we'll see if there are any conflicts.
10:04
and as we can see, in this particular file, there are conflicts.
10:08
So what we're going to have Claude Code do
10:10
is analyze these conflicts and complete the merge.
10:12
This can be quite valuable when you have small merge conflicts
10:15
that you don't want to manually go through each time.
10:18
Having tests here is also quite valuable
10:20
to make sure that once we've finished, we could
10:22
run our tests and the code base works as expected.
10:25
It's now continuing with the merge as expected.
10:27
and it's going to commit all of
10:29
these changes with the resolved merge conflicts.
10:31
If I'd like after, I can ask for it to remove
10:34
these worktrees or I can keep them there if I need.
10:36
So I'll do a quick test to
10:38
make sure that these files are here
10:40
as expected and that the merge configurations
10:41
are what are expected here as well.
10:43
We can also head back to the browser and
10:46
see if our front end changes are implemented as expected.
10:48
Looks like Claude Code has finished up, we've added necessary dependencies,
10:52
we've modified our pyproject.toml
10:54
We've added tests.
10:56
we've implemented the light dark themes.
10:58
We've implemented our black code formatter
11:01
to make sure that code is as expected in a certain format.
11:04
and added that configuration in the same file
11:06
that we worked on with another work tree.
11:09
We fixed up any conflicts.
11:11
Let's make sure this is working
11:12
as expected. So back in the browser,
11:14
I now see here, I have this lovely theme
11:17
and as I toggle through, I can
11:19
see a light theme and a dark theme.
11:21
So there might be some more things
11:22
I want to tweak here and there,
11:24
but I've been able to edit across all parts of the stack,
11:27
even do things in the linting and DevOps side of things,
11:32
all without overwriting,
11:34
causing challenging headaches through the power of Git worktrees.
11:37
In the next lesson, we're going to see how
11:40
we can use Claude Code outside of the terminal
11:42
through an integration with GitHub to allow for reviewing pull requests,
11:47
making changes and being helpful outside of the terminal ecosystem.
"""

L1: Exploring Github Integration & Hooks

"""
0:02
In this lesson, you'll learn how to use Claude
0:05
Code outside of the terminal with a GitHub integration.
0:08
You'll see how to set up Claude Code
0:11
to review pull requests and fix issues in GitHub.
0:14
You'll then learn how to execute code before
0:17
and after using tools through Claude Code hooks. Let's dive in.
0:21
We left off in the last section merging our wortrees together,
0:25
but we forgot to ask Claude to remove those worktrees.
0:28
So we're going to hop back into Claude. So
0:30
I'm going to go and pass in the resume flag
0:32
to go back to a previous
0:35
conversation that I had with my worktrees.
0:38
In this particular conversation, we can now
0:40
go back to where we were before
0:42
and finish up with removing our worktrees.
0:45
So let's ask Claude, remove the .trees folder
0:47
and the underlying worktrees, and once you're done,
0:50
push this code to GitHub. So
0:52
let's go ahead and give Claude Code
0:54
a second to run the necessary git commands
0:56
to remove that folder and then pushed our merge code
0:59
to GitHub. We'll go ahead and give Claude Code access to
1:03
see the underlying worktrees so that we not only
1:05
remove the worktrees,
1:08
but also delete the corresponding branches.
1:11
We'll go ahead and remove these particular trees.
1:14
now remove the directory and then remove the underlying branches.
1:17
Now that we've done that, let's go ahead
1:19
make sure that worked as expected, which is good.
1:21
we don't have that folder. And
1:23
now, let's push this code to GitHub.
1:25
We'll confirm that we want to
1:26
run the git push origin main command
1:28
and it looks like our code is pushed to GitHub.
1:31
Now that we've committed and pushed our code to GitHub,
1:34
let's start installing the GitHub integration that comes with Claude Code.
1:38
I'll do that using the /install-GitHub-app command.
1:42
Here you might see that you need to
1:44
include additional authentication using the command line interface.
1:48
So if you see those setup instructions, make sure to follow them.
1:51
We'll now be able to install the GitHub
1:54
app for the current repository that we're working in.
1:56
So let's go ahead and do
1:58
that. This will open up the browser.
1:59
And if I have not yet configured
2:01
this, I'll have the option to install.
2:04
What this integration allows us to do is use Claude Code
2:07
in pull requests and issues
2:09
to respond to feedback, fix errors,
2:12
modify code, and much more.
2:15
In order for this functionality to exist,
2:17
it's built on top of the software development kit
2:19
that comes with Claude Code. This SDK allows you
2:23
to use Claude Code outside
2:25
of the terminal interface. So let's head back to the terminal.
2:29
specify the workflows we want to install.
2:32
These workflows allow for tagging Claude in issues
2:35
and using Claude to automatically review code in our pull requests.
2:40
Let's install both. We'll create a long-lived token.
2:44
and here we'll have to authorize and authenticate with Claude.
2:48
Once that's done, we can head back
2:49
and we'll see that it's creating the repository information,
2:53
setting up any additional information I need,
2:55
and sending me right back to GitHub
2:57
to open a pull request.
2:59
with the changes that had been made.
3:01
We can see here automatically,
3:03
this pull request allows for GitHub Actions
3:06
to enable bug fixes, writing tests and code reviews.
3:10
We can change this if we like,
3:11
or we can go ahead and create a pull request
3:14
with the default information. In this pull request, we can see
3:18
that not only have we created
3:20
a YAML file for Claude to operate,
3:23
we also have one for code reviews.
3:24
Here we can see out of the
3:26
box, we have some pretty sane defaults. We can filter
3:29
by authors, we can specify what this is running on.
3:32
But out of the box, we get
3:33
quite a bit of really nice functionality.
3:35
If you'd like to modify the prompt
3:36
that you have in your code review, you can do that here.
3:40
And since this is a file that is tracked by git,
3:42
you can constantly edit this if you need.
3:45
I'm going to go ahead now and merge this in,
3:47
so we can start using Claude Code in GitHub.
3:50
We can go ahead and see right out of
3:52
the box that a Claude GitHub action has actually started.
3:54
This is what we're going to see out
3:56
of the box in our future pull requests.
3:58
It's going to read and analyze files, check code quality,
4:01
identify security considerations, and out of the box,
4:05
we now have a new teammate, Claude,
4:07
to check the work that we
4:08
and our other team members are doing.
4:10
This sometimes takes a little bit of
4:11
time to start, but once this has finished,
4:13
we'll get some detailed assessments from Claude,
4:15
and we'll be able to merge in the pull request
4:17
when we're ready. So it looks like the review is done,
4:19
and depending on the prompt that we give it, we can specify
4:23
how much depth and information we want here.
4:25
We see some things that are working well,
4:27
maybe some considerations that we
4:29
you may need. And if this looks good to us,
4:31
we can merge in that pull request. Now
4:33
we're going to see out of the box,
4:35
in future pull requests, Claude will help review our code.
4:37
This is really helpful when humans might miss certain things
4:41
and you need an extra step to check
4:43
that what you have is working as expected.
4:45
Let's imagine there's a situation where an issue comes up.
4:48
Someone on our team decides to add a new issue.
4:50
We could do this in GitHub, we
4:52
could even do this in Claude Code.
4:54
As you might have noticed, as we kept building on
4:56
top of this application, we started to see a new
4:59
new header that was added. This new header
5:01
might look kind of nice, but maybe we
5:03
want to revert to what we had previously.
5:05
So let's add an issue and
5:07
see if Claude can help us out.
5:08
You can imagine we have an issue here.
5:10
The application has a new header that was added,
5:14
Let's go back to the old one.
5:16
Make sure to keep the toggle theme but just
5:19
make the header look like what it was before. We'll also specify,
5:23
make sure to remove the Course Materials Assistant header.
5:27
Remove the subheader.
5:28
around ask questions, and then remove the
5:32
horizontal row below the subheader.
5:39
Now that we created this issue,
5:41
we could assign someone to tackle it.
5:42
But why don't we just ask Claude to help us out?
5:44
Claude, can you fix this for me? Once we tag in Claude,
5:47
we're going to start to give Claude a little bit of time
5:49
to fix the issue at hand.
5:51
When Claude has fixed that issue,
5:53
it should be able to generate a pull request
5:55
to fix that particular one. So
5:57
let's give Claude a little bit of
5:58
time to find that action. Here we're
6:00
going to see Claude Code is working,
6:02
and if we want to see the underlying job that's run,
6:04
we can go ahead and do that. So
6:06
let's give Claude a little bit of time
6:07
and see what it can come up with.
6:09
What you're seeing is going to look very familiar
6:11
to what we saw in the command line.
6:13
Analyze the structure, remove the header.
6:16
And here, I can even choose what to prioritize if I'd like.
6:20
But what you're seeing here is the same
6:22
thing we saw just outside of the
6:24
terminal. Not only can we use Claude
6:25
to tackle issues and pull requests,
6:28
we can also use Claude to review code as we saw before.
6:30
As we start to see its plan, we'll notice
6:33
what the changes are that are being
6:35
made, where in the codebase it's proposing things,
6:38
and as we see the pull request, we can start to
6:40
see some of the thinking and logic behind what's being done.
6:43
Seems like this one isn't too tough,
6:44
so it's going to follow these steps,
6:46
test the changes, commit and push those.
6:48
It's now made the commit necessary.
6:50
We can see the underlying description here.
6:53
If we'd like, we can create this pull request,
6:55
or we can just have Claude do all that work for us.
6:58
When we create the pull request.
6:59
We see exactly what was generated in the commit.
7:02
And now, let's go take a look and see what Claude did.
7:05
We can take a look at the underlying files that we changed.
7:08
There wasn't too much here. We can merge this in.
7:10
As we saw before, Claude's also going to take
7:12
some time and review the code that Claude wrote.
7:15
And this can actually be quite helpful because
7:16
as much as we want to trust Claude,
7:18
it's nice to have another Claude double checking its work.
7:21
So it looks like Claude Code
7:22
has approved the task I have here.
7:23
Let's merge this in. And then we'll head back to the terminal
7:26
and make sure to pull down the changes. is that we have.
7:29
So I'll head over to VS Code, pull down the changes.
7:34
And let's see if our front end looks any better.
7:37
And there we have it. The header
7:39
is taken out, the horizontal rows taken out.
7:40
We might want to bring back that
7:42
horizontal row or move this to another place.
7:44
But now we know how to do it,
7:46
not only in the terminal, but also in GitHub.
7:49
One more piece of functionality that I want
7:51
to show is something that was recently released,
7:53
which is the ability to add
7:55
what's called a hook to Claude Code.
7:57
If you're familiar here with this idea of
7:59
hooks. This is going to feel very similar.
8:01
The idea is that as we have different operations in Claude Code,
8:05
like executing a tool or something happening after a tool,
8:09
we can inject specific code to run at any
8:12
point in the life cycle of Claude Code's operation.
8:16
Let me show you what I mean
8:17
by that. Back in VS code, I'm going
8:18
to hop in back to Claude again. And
8:21
while we can make these changes manually, I
8:23
want to show you the editor that we have.
8:25
So I'm going to type in slash hooks.
8:28
manage configurations for tool events.
8:30
What you're seeing might look a little bit scary,
8:33
but it's our obligation to let you know.
8:35
If you are running arbitrary shell commands,
8:38
you have to be very careful about what you're doing.
8:40
There are quite a few different events that we can run hooks.
8:43
Before a tool is executed, we can
8:45
even stop that tool from being executed.
8:48
We can do something after, when a notification is sent,
8:51
when the user submits a prompt, when something stops,
8:53
or even before a subagent concludes its
8:56
response. So we have the ability to
8:58
programmatically to tap in to any of these events.
9:02
I want to show a simple example with a PostToolUse hook.
9:06
Start by adding a matcher. In this matcher,
9:08
I can specify the tools that I want
9:11
to be matched for this hook to run.
9:14
I'm going to add a very, very
9:15
simple example here. Anytime there is a Read
9:18
or anytime there is a Grep,
9:21
I'm going to run a simple terminal command.
9:23
The new hook or command I'm
9:25
going to run is the say command.
9:27
The say command, runs the computer's audio
9:29
and a path for what text you'd like it to say.
9:33
So if I've done this correctly, after we have read something
9:36
or use the grep tool to find something
9:38
in a file, our machine should say, all done.
9:41
Let's add this again in our project settings.
9:43
We mentioned earlier the settings.local.json file where we can specify permissions.
9:49
This is also where your hooks live.
9:51
Inside of our .claude,
9:53
we can see in our settings.local.json,
9:56
not only do we have our permissions,
9:58
but we now have a hook that we've defined.
10:00
PostToolUse is the name of the hook,
10:02
the matcher, which if you take out will apply to anything.
10:06
But here, reading or grep,
10:09
go run the command say 'All done!' when we're done.
10:11
Let's try this out. I'm going to quit out of Claude Code.
10:14
I'm going to open it up again.
10:16
read the contents of the run.sh file.
10:19
This should use the read tool as expected. All done.
10:22
And once it's done, it notifies us and tells us all done.
10:25
Well, this is kind of a fun little example, you can
10:28
imagine executing code like running tests or running linters
10:31
or potentially stopping tools from being
10:33
used if that's not what we want
10:35
or even having Claude review itself when certain things happen.
10:38
There's a lot you can do with
10:39
hooks and there's so much more that's coming.
10:41
So make sure to look at the
10:42
documentation to see everything you can do.
10:44
And you can always use Claude Code to
10:47
write hooks for you and modify them accordingly.
10:49
In the next section, we'll explore using Claude Code with Jupyter notebooks
10:52
to create visualizations, refactor code, and operate in a slightly different environment.
"""