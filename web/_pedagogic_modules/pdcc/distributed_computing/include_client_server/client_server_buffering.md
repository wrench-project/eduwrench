#### Learning Objectives

  - XXXXX

---

### Adding I/O on the Client

We have assumed no disk I/O to make things simple, but often the input data
does reside on disk. The application then reads it from disk into RAM and
sends it over to the server. This now adds a third phase to the execution
so that it proceeds as:

  1. Read data from disk into RAM
  2. Send data from RAM to the server
  3. Compute on the server and reply to the client

The above has problems. First, what if the image does not fit in RAM? Now,
this is unlikely for this application, as even high-res, uncompressed
images can typically fit in RAM given current RAM sizes. But client-server
could be used for applications for which data is large. For instance, you
can surely upload a large file, larger than your RAM, to a server, and the
program that does the upload thus cannot store that file in RAM!

The second problem is poor performance. This is because phase 2 above has
to wait for phase 1 to complete. So while the disk is doing its job, the
network is idle.  We should be able to do better because the network card
and the disk are two different hardware components, so they can work *at
the same time.*  To make it so we use a simple **buffering** idea.  As
opposed to reading the whole image into RAM, we read only a part of it into
a  "buffer", that is, a relatively small zone of RAM, say 4 KB. Then while
we send the data in the buffer to the server, we read another 4 KB of the
image into a second buffer. We wait until the first buffer has been sent
over to the server, and now we repeat, swapping the buffers (that is, we
not send the data in the second buffer to the server, and load data from
disk into the first buffer).  With this scheme, both the disk and the
network work simultaneously, save for the first time data is read from the
disk into a buffer and the last time data is sent from a buffer to the
server.  One must just pick a buffer size, making sure  it's not too small
(the extreme being be a 1-byte buffer), as otherwise network latency would
become a problem.

<div class="ui accordion fluid app-ins">
  <div class="title">
    <i class="dropdown icon"></i>
    (Open simulator here)
  </div>
  <div markdown="0" class="ui segment content sim-frame">
    {% include simulator.html src="client_server_full/" %}
  </div>
</div>

#### Practice Questions

**[A.3.p2.3]** In the Simulator just above that includes options for buffer size, please run the default options 
except select the 10 MB buffer and mark the checkbox to use the disk. What time is the last chunk read from disk?

<div class="ui accordion fluid">
   <div class="title">
     <i class="dropdown icon"></i>
     (click to see answer)
   </div>
   <div markdown="1" class="ui segment content">
        The last read should begin at approximately 8.42 seconds
   </div>
 </div>

<p></p>

**[A.3.p2.4]** Estimate the total execution time if you were to set the buffer size to 100 MB, would this increase or 
decrease total execution time? (This is not an option on 
the simulator, you will need to think about it.)


<div class="ui accordion fluid">
   <div class="title">
     <i class="dropdown icon"></i>
     (click to see answer)
   </div>
   <div markdown="1" class="ui segment content">
        The total execution time with a 100 MB buffer will be longer because the network link will not start transferring 
        data for a longer period of time. There will be no overlap between disk I/O and network transfer so it is less 
        efficient.
   </div>
 </div>

<p></p>

**[A.3.p2.5]** Compared to the previous answer, will execution time be shorter or longer with a buffer size of 1 GB?


<div class="ui accordion fluid">
   <div class="title">
     <i class="dropdown icon"></i>
     (click to see answer)
   </div>
   <div markdown="1" class="ui segment content">
        The total execution time would be the same for this workload, the data input is 100 MB, whether the buffer is 
        100 MB or 1 GB it will load the entire amount from disk first and then start the network transfer. 
   </div>
 </div>

<p></p>



