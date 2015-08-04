package messages.dao;

import java.util.Collection;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import messages.model.Message;

@Component
public class MessagesDao 
{   
    @Autowired
    private MessageRepository repo;
    
    public Collection<Message> getMessages()
    {
        return repo.getAllMessages();
    }
    
    public String createMessage(final Message message)
    {
        final UUID uuid = UUID.randomUUID();
        final String id = uuid.toString();
        message.setId(id);
        repo.addMessage(id, message);
        return id;
    }
    
    public Message getMessage(final String id)
    {
        return repo.getMessage(id);
    }
    
    public void removeMessage(final String id)
    {
        repo.removeMessage(id);
    }

}