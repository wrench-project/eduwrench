# Gatsby with Markdown Parsing





## Setup

----

I had a lot of trouble getting everything working initially due to version mismatches with npm/node/plugins. I was finally able to get it working by downgrading to:


>wrench@wrench-ra-mb server % node -v  
>v12.18.0  
>wrench@wrench-ra-mb server % npm -v  
>6.14.4  


You can do this with:

>npm install -g npm@6.14.4

and I believe that node automatically adjusted itself to be compatible. 

**EDIT BY HENRI:** On my Mac I had to do the following for node to go to the correct version:

>sudo npm install -g n install n
>sudo n 12.18.0

All the plugins should work using the provided package-lock.json file where their versions are specified. Troubleshooting steps would usually mean deleting the node_modules directory and downloading everything again. 

There are a lot of unused gatsby files still hanging around from the template Jason was using, fyi. 




## What has been done so far
---

- `src/components/Markdown.js` is what is doing all the conversion, and `src/components/Markdown.css` is where all the fixes to css (mostly background color) are.

- `src/pages/pedagogic_modules/include_multi_core_computing/task_parallelism.js` is the demo page that Jason was working on. I modified this to use the Markdown component rather than the image files for equations.
- `load_imbalance.js` was partially done by Jason, but is missing half of the content or so. 
- `ram_and_io.js` and the other files in the `/include_multi_core_computing/` directory are in progress versions I (Will) did to test out running the entirety of the Markdown through the component. 
- `/include_single_core_computing/io.js` was done by Jason it looks like, the only one in that directory that was ported. It has a working version of a simulator which none of the others I have seen have.

## Process of using Markdown component
---

1. create/navigate to appropriate js file
1. Import the markdown component `import Markdown from '../../../Components/Markdown';`
1. Declare const strings and paste in Markdown content.
  1. Modify the markdown as necessary to be parsed successfully.
1. Within the return statement, use the component and pass it the string `<Markdown className="equation">{string}</Markdown>`, classname is important for the css tweaks.
1. That's it (so far)


### List of things that cannot be parsed in Markdown currently: 
  1. Align statements/ampersand in equations (remove these, replace with html as necessary)
  2. Backslashes and percent signs (among probably other symbols) need to be escaped. 
  3. Images tags will need to be recreated.
  4. Markdown tables are not able to be parsed.
  5. Embedded simulators and other moving pieces like accordion are not added.





