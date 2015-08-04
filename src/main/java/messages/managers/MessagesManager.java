package messages.managers;

import java.util.Collection;
import messages.dao.MessagesDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import messages.model.Message;

@Component
public class MessagesManager {
    @Autowired
    private MessagesDao messagesDao;

    public Collection<Message> getMessages() {
        return messagesDao.getMessages();
    }
    
    public Message getMessage(final String id)
    {
        return messagesDao.getMessage(id);
    }
    
    public String createMessage(final Message message)
    {
        return messagesDao.createMessage(message);
    }
    
    public void removeMessage(final String id)
    {
        messagesDao.removeMessage(id);
    }
}
