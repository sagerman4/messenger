package messages.dao;

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.stereotype.Component;
import messages.model.Message;

/**
 *
 * @author joshdavi
 */
@Component
public class MessageRepository {
    private final Map<String,Message> repository = new LinkedHashMap<>();
    
    public Message getMessage(final String id)
    {
        return repository.get(id);
    }
    
    public Collection<Message> getAllMessages()
    {
        return repository.values();
    }
    
    public void addMessage(final String id, final Message message)
    {
        repository.put(id, message);
    }
    
    public void removeMessage(final String id)
    {
        repository.remove(id);
    }
}
