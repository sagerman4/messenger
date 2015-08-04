package messages.rest;

import messages.model.Message;
import com.google.gson.Gson;
import java.util.Collection;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import messages.managers.MessagesManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Path("messages")
@Component
public class MessagesService {
       
    @Autowired
    private MessagesManager messagesManager;
   
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMessages(){
        final Collection<Message> messages = messagesManager.getMessages();
        return Response.ok(new Gson().toJson(messages)).build();
    }
    
    @GET
    @Path("{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMessages(@PathParam("id") final String id){
        final Message message = messagesManager.getMessage(id);
        return Response.ok(new Gson().toJson(message)).build();
    }
    
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createMessage(final String params){
        System.out.println("params:  " + params);
        final Message message = new Gson().fromJson(params, Message.class);
        final String id = messagesManager.createMessage(message);
        return Response.ok(new Gson().toJson(id)).build();
    }
    
    @Path("{id}")
    @DELETE
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeMessage(@PathParam("id") final String id)
    {
        messagesManager.removeMessage(id);
        return Response.ok().build();
    }
}
