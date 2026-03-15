using AutoMapper;
using Repository.Entities;
using Service1.Dto.TopicDto;
using Service1.Dto.ChatMessageDto;
using Service1.Dto.ChatSessionDto;
using Service1.Dto.CustomerDto;
using Service1.Dto.RepresentativeDto;

namespace Service1.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Topic Mappings
            CreateMap<Topic, TopicDto>().ReverseMap();
            CreateMap<Topic, TopicAddDto>().ReverseMap();

            // Customer Mappings
            CreateMap<Customer, CustomerChatDto>().ReverseMap();
            CreateMap<Customer, CustomerRegisterDto>().ReverseMap();
            CreateMap<Customer, CustomerLoginDto>().ReverseMap();

            // Representative Mappings
            CreateMap<Representative, RepresentativeDto>().ReverseMap();
            CreateMap<Representative, RepresentativeChatDto>().ReverseMap();
            CreateMap<Representative, RepresentativeRegisterDto>().ReverseMap();
            CreateMap<Representative, RepresentativeUpdateDto>().ReverseMap();

            // Message Mappings
            CreateMap<ChatMessage, ChatMessageDto>().ReverseMap();
            CreateMap<ChatMessage, ChatMessageChatDto>().ReverseMap();
            CreateMap<ChatMessage, ChatMessageSendDto>().ReverseMap();

            // Session Mappings
            CreateMap<ChatSession, ChatSessionDto>().ReverseMap();
            CreateMap<ChatSession, ChatSessionCreateDto>().ReverseMap();
            CreateMap<ChatSession, ChatSessionUpdateDto>().ReverseMap();
        }
    }
}