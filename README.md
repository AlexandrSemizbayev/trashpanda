<div align="center">
  <img src="logo.png" alt="project logo with a raccoon on it cleaning your files" width="300">
</div>
<h1 align="center">@jstormer/trashpanda 🦝</h1>

A simple Node.js script to find and delete all matching folders or files.

The author was too lazy to manually delete all node_modules folders on his laptop. He also tried to find them using macOS Finder, but the results were overwhelming and included many files that were probably related to node_modules. Because of that, it wasn’t clear what was safe to delete — so this script was born 🙂
</br>
<div align="center">
<h2>🫠 Let the fun begin</h2>
<img
  src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHl4Ym5pOHZiajFhZ2kxdzA2bjg1eWRyY2k2aWdxdmFtbWIzN3FzdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/aSHhWd4YQarYs/giphy.gif"
/>
</div>

## Installation:
The installation process is very simple, especially if you already have experience with npm or Node.js:
```

 $ npm i -g trash-panda && trashpanda

 ```

## Flow:

```mermaid
  flowchart TD
    FS['User saves file at:'] --> RP['/Users/that_cool_user/messy_projects/downloads/clean_up']
    NEED['Since he needs to clean up all folders in messy_projects, he runs clean_up with following paths]
    NEED --> ABS['../../']
    NEED --> REL['/Users/that_cool_user/messy_projects']
    NEED --> DG[Or simply drag'n'drop the messy_projects folder into terminal]
    FINAL_PATH['Result is: /Users/that_cool_user/messy_projects']
    ABS --> FINAL_PATH
    REL --> FINAL_PATH
    DG --> FINAL_PATH
    RP --> NEED
    FINAL_PATH --> NAME
    NAME[Next step: enter file or folder name, you want to delete. For example: node_modules]
    NAME --> ALL
    ALL[Are you willing to delete all matches in] ATT2@--> FINAL_PATH
    ALL ==> YES[Yes]
    YES ==> YM[Gotcha, all folders and subfolders will be scaned]
    ALL ==> NO[No]
    NO ==> NM[In case you was to exclude some folders from search]
    ATT{No matter what you select, the project will be excluded from search}

    YES --> ATT
    NO  --> ATT
    ATT ATT1@--> RP

    NM --> EXCL[Enter folder paths to exclude, one by one] 
    EXCL --> SCAN
    YM --> SCAN
    SCAN[Scanning...] --> SCANRES[
        !!!
        Review matched and structured files
    ]
    SCANRES ==> INPT[Do the matches align your request:]
    INPT ==> yeah[yes] ==> delete[Deleting matches]
    INPT ==> nope[no] ==> ok[Ok, maybe next time]
    




    style RP color: #ffc902
    classDef ATTENTION stroke: #ffc902, color: #ffc902
    classDef SUCCESS color: #8ec902, stroke: #8ec902
    classDef DANGER color: red, stroke: red
    class ABS ATTENTION
    class REL ATTENTION
    class DG ATTENTION
    class FINAL_PATH SUCCESS
    class SCANRES DANGER
    class yeah SUCCESS
    class delete SUCCESS
    class SCAN SUCCESS
    style ATT stroke: #ffc902, color: #ffc902
    classDef attArrow stroke: #ffc802, stroke-dasharray: 9,5,stroke-dashoffset: 900,animation: dash 25s linear infinite;
    class ATT1 attArrow
    class ATT2 attArrow
```



<div align="center">
<h2>🎉🎉🎉 Congrats, we made it through</h2>
<img
  src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2o5b3l4cWk1bGJucDViNjZnazdnbHhwamJqMWYzOWdjN3RqM2ltOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1dagNhv8Oqu6l8U3ZK/giphy.gif"
/>
</div>


<p>P.S. Since someone already made a useless package called trashpanda about 10 years ago, I had to go with <b><u>@jstormer/trashpanda</u></b>. But in my heart, it will always be TrashPanda.✌️</p>