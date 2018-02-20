# Naraka Editor

## What
This software allow you to create a story runnable by Naraka. See Naraka for more informations. This is a full client application with no backend.

## Why
WHen I think of something fun I like to fast code a concept of it. The purpose of the Naraka project was to build an engine to create and run small game, where dialog are the center of the gameplay.

## Sorry
Sorry for the "Frenchglish / Franglais" in the UI... =/

# Documentation

## I - Walkthrough

### Vocabulary
Step node : step of the game. Display messages and available answer.

Answer node : possible answer available from a step node.

### 1 - Your first step :
1 - clic on "New chapters"

2 - Drag from "Add Step" to the graph. Then clic on it.

3 - Clic on "Edit" or press CTRL+E

4 - Write a title, for exemple `Sister`. The title will be displayed in the top of the screen.

5 - Clic "Add message" and complete the field. `from : sister` `text : Hello brother !` . Name are used in Metadata (see Metadata).

6 - Clic "Add message" and complete the field. `from : sister` `text : How are you ?`

7 - Clic outside to close

This is your first step !

### 2 - Adding answers choices
8 - Drag from "Add answer". Then clic on it. Clic on "Edit" or press CTRL+E

9 - Write down an answer. `Fine`

11 - Drag from "Add answer". Then clic on it. Clic on "Edit" or press CTRL+E

12 - Write down an answer. `Bad`

Those are the possible answer available from the first step

### 3 - Linking first step to answers
13 - Drag from the scare next to the "S" of the first step, to the "E" of an answer node.

14 - Do the same for the other answer node.

### 4 - Adding next step

15 - Drag from "Add Step" to the graph. Then clic on it. Clic on "Edit" or press CTRL+E

16 - You don't have to write a title. Naraka will keep the last title.

17 - Add a message. `from : sister` `text : Nice !`

18 - Link `Fine` answer node to this step node.

19 - Drag from "Add Step" to the graph. Then clic on it. Clic on "Edit" or press CTRL+E

20 - Add a message. `from : sister` `text : =(`

21 - Link `Bad` answer node to this step node.

22 - Clic on "Serialize to clipboard" and save it somewhere. You can reload it by clicking "deserialize from input"

You have your first story !

## II - Advanced

### Metadata
You can attach background color and text color which may be used by Nakara to display a massage. This can be set by clicking "Metadata".

Clic "Ajouter une personne". Set name, color and backgroundColor. The name must match one of the message name.

### Chapter
To keep the graph clear, you can regroup Step inside chapter. To go to a chapter, you must use the Next Chapter Node (green). After dragging the node, you can edit him to set the linked chapter.

Chapter node can be linked from both Step and Answer node.

## III - Use and contribution

Feel free to use this project. Contribution are welcome.

If you are not a developper but want to try making a story, feel free to contact me to ask for help.
