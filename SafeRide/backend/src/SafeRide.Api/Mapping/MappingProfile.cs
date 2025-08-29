using AutoMapper;
using SafeRide.Core.Entities;
using SafeRide.Api.DTOs.Auth;
using SafeRide.Api.DTOs.Verification;
using SafeRide.Api.DTOs.Rides;
using SafeRide.Api.DTOs.Credits;

namespace SafeRide.Api.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Parent, ParentDto>();
            CreateMap<ParentDto, Parent>();

            CreateMap<RideOffer, RideOfferDto>();
            CreateMap<RideOfferDto, RideOffer>();

            CreateMap<RideReservation, RideReservationDto>();
            CreateMap<RideReservationDto, RideReservation>();

            CreateMap<VerificationDocument, VerificationDocumentDto>();
            CreateMap<VerificationDocumentDto, VerificationDocument>();

            CreateMap<CreditTransaction, CreditTransactionDto>();
            CreateMap<CreditTransactionDto, CreditTransaction>();
        }
    }
}