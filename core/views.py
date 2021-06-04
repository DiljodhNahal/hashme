from rest_framework import views, status
from rest_framework.response import Response

import hashlib as decoder

from hashme.token_validation import validate


class encode(views.APIView):

    def get(self, request):

        response = {}
        errors = []

        process = True

        if not request.META.get('HTTP_KEY'):
            process = False
            response_status = status.HTTP_401_UNAUTHORIZED
            errors.append("Missing header 'KEY'. Must pass in token to validate request.")
        elif not validate(request.META.get('HTTP_KEY')):
            process = False
            response_status = status.HTTP_403_FORBIDDEN
            errors.append("Invalid API Token.")

        if process:
            response_status = status.HTTP_200_OK
            response["encoders"] = decoder.algorithms_guaranteed

        if errors:
            response["errors"] = errors

        return Response(response, status=response_status)

    def post(self, request):

        response = {}
        errors = []

        process = True

        if not request.META.get('HTTP_KEY'):
            process = False
            response_status = status.HTTP_401_UNAUTHORIZED
            errors.append("Missing header 'KEY'. Must pass in token to validate request.")
        elif not validate(request.META.get('HTTP_KEY')):
            process = False
            response_status = status.HTTP_403_FORBIDDEN
            errors.append("Invalid API Token.")

        if "encoder" not in request.data:
            process = False
            response_status = status.HTTP_400_BAD_REQUEST
            errors.append("Missing 'encoder'. Must pass in encoder type to encode data.")
        elif request.data["encoder"] not in decoder.algorithms_guaranteed:
            process = False
            response_status = status.HTTP_400_BAD_REQUEST
            errors.append(f"Encoder of type '{request.data['encoder']}' not available.")

        if "data" not in request.data:
            process = False
            response_status = status.HTTP_400_BAD_REQUEST
            errors.append("Missing 'data'. Must pass in data to be encoded.")

        if process:
            original = str(request.data["data"])
            method_to_call = getattr(decoder, request.data["encoder"])
            if "shake" not in request.data["encoder"].lower():
                response["hashed"] = method_to_call(original.encode('utf-8')).hexdigest()
            else:
                length = int(request.data["bits"] / 8)
                response["hashed"] = method_to_call(original.encode('utf-8')).hexdigest(length)
            response_status = status.HTTP_200_OK

        if errors:
            response["errors"] = errors

        return Response(response, status=response_status)
